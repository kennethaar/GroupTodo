/* ============================================================
   LEAN UI MOCKUP -- the real app with a made-up vault
   build-lean-ui-mockup.py puts this file in front of grouptodo.html and calls
   MOCKUP_DEMO.seed() straight after the app's own seedIfEmpty(). Everything
   else on the page is the app itself, unchanged.

   Nothing here may reach real storage: every page opened from disk shares one
   file:// origin, so a mockup writing to localStorage or IndexedDB would be
   writing into the vault of the real grouptodo.html beside it. Both are
   swapped for memory before the app looks, and a reload starts afresh.
   ============================================================ */
(function () {
  const mem = new Map();
  const store = {
    get length() { return mem.size; },
    key: i => Array.from(mem.keys())[i] ?? null,
    getItem: k => mem.has(String(k)) ? mem.get(String(k)) : null,
    setItem: (k, v) => { mem.set(String(k), String(v)); },
    removeItem: k => { mem.delete(String(k)); },
    clear: () => mem.clear(),
  };
  Object.defineProperty(window, "localStorage", {value: store, configurable: true});
  Object.defineProperty(window, "sessionStorage", {value: store, configurable: true});
  Object.defineProperty(window, "indexedDB", {value: undefined, configurable: true});

  const pad = n => String(n).padStart(2, "0");
  const d = new Date();
  const today = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());

  // The startup questions, already answered: who, where, and no tour.
  const pref = (k, v) => store.setItem("gtd.pref." + k, v);
  pref("onboarded", today);
  pref("welcomed", today);
  pref("identity", "Kenneth Aar");
  pref("activeSpace", "Work");
  pref("spaces", JSON.stringify([{name: "Work", kind: "local", askedStorage: true, color: "#2f6fde"}]));
})();

window.MOCKUP_DEMO = {
  seed() {
    if (V.pages.has(join(DIRS.orgs, "Nordvik Shipping.md"))) return;
    const T = todayISO();
    const day = n => "[[" + shiftISO(T, n) + "]]";
    const link = (pfx, name) => "[[" + pfx + "/" + name + "]]";

    /* ---------- 7 companies ---------- */
    const ORGS = {
      "Nordvik Shipping":   "Freight and logistics client, Bergen",
      "Fjellstad Bygg":     "Building contractor for the new office",
      "Brightline Software":"Supplier of the booking platform",
      "Aurora Energi":      "Energy client, framework agreement",
      "Kvamme Advokatfirma":"Our lawyers",
      "Lumen Design":       "Design studio doing the brand refresh",
      "Havbris Seafood":    "Prospect, met at the trade fair",
    };
    for (const [name, about] of Object.entries(ORGS)) {
      putPage(join(DIRS.orgs, name + ".md"), {
        props: {title: name, created: day(-60)},
        blocks: [newBlock({title: about})],
      });
    }

    /* ---------- 10 people: 3 colleagues, 7 at the companies ---------- */
    const PEOPLE = {
      "Ingrid Solberg": {member: true, about: "Project lead, sits next to me"},
      "Marcus Lind":    {member: true, about: "Finance and contracts"},
      "Sofia Berg":     {member: true, about: "Sales, owns the Aurora account"},
      "Lars Haugen":    {org: "Nordvik Shipping",    about: "Head of operations"},
      "Emma Dahl":      {org: "Fjellstad Bygg",      about: "Site manager"},
      "Jonas Eriksen":  {org: "Brightline Software", about: "Account manager"},
      "Nora Vik":       {org: "Aurora Energi",       about: "Procurement"},
      "Henrik Moe":     {org: "Kvamme Advokatfirma", about: "Partner, contracts"},
      "Maja Strand":    {org: "Lumen Design",        about: "Creative director"},
      "Oskar Nilsen":   {org: "Havbris Seafood",     about: "CEO"},
    };
    for (const [name, p] of Object.entries(PEOPLE)) {
      const props = {title: name};
      if (p.member) props.member = "true";
      if (p.org) props.org = link("o", p.org);
      putPage(personPath(name), {props, blocks: [newBlock({title: p.about})]});
    }
    ensureMemberPage();

    for (const c of ["phone", "computer", "office", "errands"]) {
      putPage(join(DIRS.contexts, c + ".md"), {props: {title: c}, blocks: []});
    }

    /* ---------- tasks, written the way the outliner writes them ---------- */
    const task = (state, title, props = {}) =>
      stampAuthor(newBlock({state, title, props: Object.assign({}, props)}));
    const todo = (t, p) => task("TODO", t, p);
    const doing = (t, p) => task("DOING", t, p);
    const done = (t, p) => task("DONE", t, p);
    const wait = (who, t, p = {}) => task("WAIT", t, Object.assign({waiting_for: link("p", who)}, p));
    const to = (who, t, p = {}) => todo(t, Object.assign({assigned: who, assigned_at: nowStamp()}, p));

    /* ---------- 20 projects: 10 active, the rest spread over the others ---------- */
    const project = (code, title, {org, with: people = [], outcome, deadline, tasks = []}) => {
      const page = projectTemplateLines(slugify(title), code);
      if (org) page.props.org = link("o", org);
      if (people.length) page.props.with = people.map(n => link("p", n)).join(", ");
      if (outcome) page.props.outcome = outcome;
      if (deadline) page.props.deadline = day(deadline);
      page.blocks = tasks;
      putPage(join(STATUS_DIRS[code], slugify(title) + ".md"), page);
    };

    // 1 = active
    project("1", "Nordvik freight portal", {
      org: "Nordvik Shipping", with: ["Lars Haugen", "Ingrid Solberg"], deadline: 21,
      outcome: "Nordvik books every shipment through the portal",
      tasks: [
        doing("Draft the rollout plan for the three Bergen depots [[c/computer]]"),
        todo("Call [[p/Lars Haugen]] about the test accounts [[c/phone]]", {SCHEDULED: day(0)}),
        to("Ingrid Solberg", "Write the user guide for depot staff"),
        wait("Lars Haugen", "Lars to send the list of depot users", {DEADLINE: day(-2)}),
        done("Kick-off meeting with Nordvik"),
      ]});
    project("1", "New office fit-out", {
      org: "Fjellstad Bygg", with: ["Emma Dahl", "Marcus Lind"], deadline: 45,
      outcome: "Everybody moved in and working on the third floor",
      tasks: [
        todo("Walk the third floor with [[p/Emma Dahl]] [[c/office]]", {SCHEDULED: day(2)}),
        todo("Choose desks and chairs from the two quotes [[c/computer]]"),
        to("Marcus Lind", "Approve the revised budget", {DEADLINE: day(5)}),
        wait("Emma Dahl", "Emma to confirm the electricians' dates"),
      ]});
    project("1", "Booking platform upgrade", {
      org: "Brightline Software", with: ["Jonas Eriksen"], deadline: 30,
      outcome: "Version 5 live with no lost bookings",
      tasks: [
        todo("Read the release notes for version 5 [[c/computer]]"),
        todo("Book a test window with [[p/Jonas Eriksen]] [[c/phone]]"),
        wait("Jonas Eriksen", "Jonas to share the staging login"),
      ]});
    project("1", "Aurora framework renewal", {
      org: "Aurora Energi", with: ["Nora Vik", "Sofia Berg", "Henrik Moe"], deadline: 14,
      outcome: "Framework agreement signed for another three years",
      tasks: [
        to("Sofia Berg", "Prepare the price proposal", {DEADLINE: day(4)}),
        todo("Email [[p/Nora Vik]] the draft terms [[c/computer]]", {SCHEDULED: day(1)}),
        wait("Henrik Moe", "Henrik to review the liability clause"),
        done("Collect last year's volumes"),
      ]});
    project("1", "Brand refresh", {
      org: "Lumen Design", with: ["Maja Strand"], deadline: 60,
      outcome: "New logo and templates in use everywhere",
      tasks: [
        todo("Give [[p/Maja Strand]] feedback on the three logo options [[c/computer]]", {SCHEDULED: day(0)}),
        todo("Collect every template we send to customers"),
        done("Brief Lumen on what we want"),
      ]});
    project("1", "Havbris first order", {
      org: "Havbris Seafood", with: ["Oskar Nilsen", "Sofia Berg"],
      outcome: "Havbris has placed a first order",
      tasks: [
        todo("Call [[p/Oskar Nilsen]] to follow up the trade fair [[c/phone]]", {SCHEDULED: day(-1)}),
        to("Sofia Berg", "Send Havbris the reference case"),
      ]});
    project("1", "Quarterly report Q3", {
      with: ["Marcus Lind"], deadline: 3,
      outcome: "Report sent to the board",
      tasks: [
        doing("Write the summary page [[c/computer]]"),
        to("Marcus Lind", "Pull the Q3 numbers"),
        todo("Print five copies for the board meeting [[c/office]]"),
      ]});
    project("1", "Hire a second developer", {
      with: ["Ingrid Solberg"], deadline: 40,
      outcome: "A developer has signed and has a start date",
      tasks: [
        todo("Post the job ad [[c/computer]]"),
        to("Ingrid Solberg", "Shortlist the first ten applicants"),
        todo("Book interview rooms for week 47 [[c/office]]"),
      ]});
    project("1", "Contract templates update", {
      org: "Kvamme Advokatfirma", with: ["Henrik Moe", "Marcus Lind"],
      outcome: "Every customer contract uses the new GDPR wording",
      tasks: [
        wait("Henrik Moe", "Henrik to send the new standard clauses"),
        todo("List which contracts are still on the old template [[c/computer]]"),
      ]});
    project("1", "Team offsite", {
      with: ["Ingrid Solberg", "Marcus Lind", "Sofia Berg"], deadline: 25,
      outcome: "Two days away with a plan for next year",
      tasks: [
        todo("Book the hotel in Geilo [[c/phone]]"),
        todo("Buy a birthday card for Sofia [[c/errands]]"),
        to("Sofia Berg", "Draft the agenda"),
      ]});

    // 2 = someday/maybe
    project("2", "Customer newsletter", {
      outcome: "A short monthly letter customers actually open",
      tasks: [todo("Look at three newsletters we like")]});
    project("2", "Move the wiki to the new platform", {
      org: "Brightline Software", with: ["Jonas Eriksen"],
      tasks: [todo("Ask Jonas whether their platform has a wiki")]});
    project("2", "Office plants", {
      tasks: [todo("Find a plant rental company")]});
    project("2", "Expand into Sweden", {
      with: ["Sofia Berg"],
      outcome: "First Swedish customer signed",
      tasks: [todo("Read the market report Sofia sent")]});

    // 3 = waiting for a third party
    project("3", "Nordvik warehouse scanners", {
      org: "Nordvik Shipping", with: ["Lars Haugen"],
      tasks: [wait("Lars Haugen", "Lars to decide between the two scanner models")]});
    project("3", "Parking permits", {
      org: "Fjellstad Bygg", with: ["Emma Dahl"],
      tasks: [wait("Emma Dahl", "The municipality's answer on permits, via Emma")]});
    project("3", "Aurora pilot site", {
      org: "Aurora Energi", with: ["Nora Vik"],
      tasks: [wait("Nora Vik", "Nora to get budget sign-off for the pilot")]});

    // 0 = completed, - = cancelled
    project("0", "Website relaunch", {
      org: "Lumen Design", with: ["Maja Strand"],
      tasks: [done("Launch the new site"), done("Redirect the old addresses")]});
    project("0", "Annual accounts", {
      with: ["Marcus Lind"],
      tasks: [done("Sign the annual accounts"), done("Send them to the auditor")]});
    project("-", "Trade fair stand in Oslo", {
      with: ["Sofia Berg"],
      tasks: [task("CANCELLED", "Book the stand")]});

    /* ---------- today's page, so the day is not blank ---------- */
    const jp = ensureJournal(T);
    const jpage = getPage(jp);
    jpage.blocks.push(
      todo("Reply to the parking email [[c/computer]]"),
      newBlock({title: "Lunch with [[p/Ingrid Solberg]] - she wants the depot guide done before the rollout"}),
    );
    putPage(jp, jpage);

    if (typeof clearMemo === "function") clearMemo();
  },
};
