/* ============================================================
   GroupToDo regression battery -- run with: node tests/run.mjs

   Evaluated inside docs/demo.html once the app has started, so every app
   function and the seeded demo vault are in reach. Each test() is one thing
   the app is promised to do. When a feature lands, add a test for it under
   its section (or a new section); when a bug is fixed, add the test that
   would have caught it, with the issue number in its name.

   Tests run in order and share the vault. A test that changes pages should
   make its own (see scratchProject) rather than lean on another test's.
   ============================================================ */
var GTD_TEST = (() => {
  const tests = [];
  const test = (name, fn) => tests.push({name, fn});

  /* ---------- assertions ---------- */
  const show = v => typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v, null, 0);
  const eq = (got, want, what = "") => {
    if (show(got) !== show(want)) throw new Error((what ? what + ": " : "") + "expected " + show(want) + ", got " + show(got));
  };
  const ok = (v, what = "expected true") => { if (!v) throw new Error(what); };
  const has = (text, part, what = "") => {
    if (!String(text).includes(part)) throw new Error((what ? what + ": " : "") + show(part) + " not found in " + show(String(text).slice(0, 300)));
  };

  /* ---------- helpers ---------- */
  const T = () => todayISO();
  const content = () => document.querySelector("#content");
  const settle = () => new Promise(r => setTimeout(r, 0));
  let scratchN = 0;
  // A fresh active project of the test's own, so tests do not step on each other.
  const scratchProject = (title, tasks = []) => {
    const name = "Test " + (++scratchN) + " " + title;
    const page = projectTemplateLines(slugify(name), "1");
    page.blocks = tasks.map(([state, t]) => stampAuthor(newBlock({state, title: t})));
    const path = join(STATUS_DIRS["1"], slugify(name) + ".md");
    putPage(path, page);
    return path;
  };

  /* ============================================================
     Version
     ============================================================ */
  test("version is MAJOR.MINOR.PATCH", () => ok(/^\d+\.\d+\.\d+$/.test(APP_VERSION), "APP_VERSION is " + APP_VERSION));
  test("version is shown beside the name, top left", () => {
    eq(document.querySelector("#appVersion").textContent, "v" + APP_VERSION);
    has(document.querySelector("#brand").textContent, "GroupToDo");
  });

  /* ============================================================
     Start-up and the demo vault
     ============================================================ */
  test("app finished starting with the demo vault", () => {
    ok(INIT_DONE && V.loaded, "INIT_DONE and V.loaded");
    ok(getPage(join(DIRS.orgs, "Nordvik Shipping.md")), "demo org Nordvik Shipping");
    ok(getPage(personPath("Lars Haugen")), "demo person Lars Haugen");
    ok(getPage(journalPath(T())) || allPages().some(p => pageKind(p) === "journal"), "a journal page");
  });
  test("identity is the demo user", () => eq(whoAmI(), "Kenneth Aar"));

  /* ============================================================
     Every screen draws
     ============================================================ */
  for (const view of Object.keys(VIEWS).filter(v => v !== "page")) {
    const subs = SUBS[view] ? SUBS[view].map(s => s[0]) : [null];
    for (const sub of subs) {
      test("view draws: " + view + (sub ? " / " + sub : ""), async () => {
        go(view, sub ? {sub} : {});
        await settle();
        eq(state.view, view, "state.view");
        ok(content().children.length > 0, "#content is empty");
        if (typeof closeModal === "function") closeModal();
      });
    }
  }
  test("every kind of demo page opens", async () => {
    const seen = new Set();
    for (const path of allPages()) {
      const kind = pageKind(path);
      if (seen.has(kind)) continue;
      seen.add(kind);
      openPage(path);
      await settle();
      ok(content().children.length > 0, kind + " page " + path + " drew nothing");
    }
    for (const k of ["journal", "project", "person", "org", "context"]) ok(seen.has(k), "no " + k + " page in the demo");
    go("today");
  });
  test("search finds a demo task", async () => {
    go("search", {searchDraft: "depot", query: "depot"});
    await settle();
    has(content().textContent, "depot");
  });

  /* ============================================================
     Markdown: the files are the truth
     ============================================================ */
  const SAMPLE = [
    "title:: Sample",
    "status:: 1 = active",
    "",
    "- TODO Call [[p/Lars Haugen]] [[c/phone]]",
    "  SCHEDULED:: [[2026-11-02]]",
    "  a note under the task",
    "  - DOING Child task",
    "    - DONE Grandchild",
    "- WAIT Waiting on the quote",
    "  waiting_for:: [[p/Emma Dahl]]",
    "- A plain line",
    "",
  ].join("\n");
  test("parsePage reads props, states, nesting and notes", () => {
    const p = parsePage(SAMPLE);
    eq(p.props.title, "Sample");
    eq(p.blocks.length, 3, "top-level blocks");
    eq(p.blocks[0].state, "TODO");
    eq(p.blocks[0].title, "Call [[p/Lars Haugen]] [[c/phone]]");
    eq(p.blocks[0].props.SCHEDULED, "[[2026-11-02]]");
    eq(p.blocks[0].body, ["a note under the task"]);
    eq(p.blocks[0].children[0].state, "DOING");
    eq(p.blocks[0].children[0].children[0].state, "DONE");
    eq(p.blocks[1].props.waiting_for, "[[p/Emma Dahl]]");
    eq(p.blocks[2].state, null);
  });
  test("parse -> serialize gives the same file back", () => eq(serializePage(parsePage(SAMPLE)), SAMPLE));
  test("an empty bullet survives a round trip", () => {
    const t = "- first\n-\n- third\n";
    eq(serializePage(parsePage(t)), t);
  });
  test("splitState knows the states and their aliases", () => {
    eq(splitState("TODO Buy milk"), ["TODO", "Buy milk"]);
    eq(splitState("WAITING on Bob"), ["WAIT", "on Bob"]);
    eq(splitState("CANCELED gone"), ["CANCELLED", "gone"]);
    eq(splitState("NOW go"), ["DOING", "go"]);
    eq(splitState("LATER maybe"), ["TODO", "maybe"]);
    eq(splitState("NASA launch"), [null, "NASA launch"]);
  });
  test("slugify keeps names but drops what a file name cannot hold", () => {
    eq(slugify("Q3: plan/budget?"), "Q3- plan-budget-");
    eq(slugify("  two   spaces "), "two spaces");
    eq(slugify(""), "Untitled");
  });
  test("pageKind reads the folder", () => {
    eq(pageKind(join(DIRS.active, "X.md")), "project");
    eq(pageKind(join(DIRS.people, "X.md")), "person");
    eq(pageKind(join(DIRS.orgs, "X.md")), "org");
    eq(pageKind(join(DIRS.contexts, "X.md")), "context");
    eq(pageKind(join(DIRS.mail, "X.md")), "email");
    eq(pageKind(join(DIRS.reviews, "X.md")), "review");
    eq(pageKind(join(DIRS.lists, "X.md")), "checklist");
    eq(pageKind(journalPath(T())), "journal");
  });

  /* ============================================================
     Dates, clocks and repeats
     ============================================================ */
  test("readClock reads every way a time is typed", () => {
    eq(readClock("8:43"), "08:43");
    eq(readClock("08.43"), "08:43");
    eq(readClock("0843"), "08:43");
    eq(readClock("843"), "08:43");
    eq(readClock("24:00"), null);
    eq(readClock("12:60"), null);
    eq(readClock("soon"), null);
  });
  test("date arithmetic", () => {
    eq(shiftISO("2026-02-27", 2), "2026-03-01");
    eq(shiftISO("2026-01-01", -1), "2025-12-31");
    eq(dateDiffDays("2026-10-01", "2026-10-29"), 28);
    eq(addMonths("2026-01-31", 1), "2026-02-28");
    eq(addMonths("2024-01-31", 1), "2024-02-29");
    ok(String(isoWeek("2026-10-29")).includes("44"), "2026-10-29 is week 44, got " + isoWeek("2026-10-29"));
  });
  test("parseWhen: tomorrow, links kept at the end", () => {
    const w = parseWhen("Call Bob tomorrow [[c/phone]]");
    eq(w.title, "Call Bob [[c/phone]]");
    eq(w.SCHEDULED, shiftISO(T(), 1));
  });
  test("parseWhen: due:, pri:, a clock and a repeat", () => {
    const a = parseWhen("Pay rent due:tomorrow pri:h");
    eq([a.title, a.DEADLINE, a.priority], ["Pay rent", shiftISO(T(), 1), "H"]);
    const b = parseWhen("Dentist tomorrow at 14:30");
    eq([b.title, b.SCHEDULED, b.time], ["Dentist", shiftISO(T(), 1), "14:30"]);
    const c = parseWhen("Water plants every week");
    eq([c.title, c.repeat], ["Water plants", "every week"]);
  });
  test("dateFromWords", () => {
    eq(dateFromWords("today"), T());
    eq(dateFromWords("tomorrow"), shiftISO(T(), 1));
    eq(dateFromWords("day after tomorrow"), shiftISO(T(), 2));
    eq(dateFromWords("gibberish words"), null);
  });
  test("parseRepeat", () => {
    eq(parseRepeat("weekly"), {unit: "day", n: 7});
    eq(parseRepeat("every 2 weeks"), {unit: "day", n: 14});
    eq(parseRepeat("quarterly"), {unit: "month", n: 3});
    eq(parseRepeat("every 0 days"), null);
    eq(parseRepeat("whenever"), null);
  });
  test("nextRepeatDate is always strictly later", () => {
    const base = shiftISO(T(), 10);
    eq(nextRepeatDate("daily", base), shiftISO(base, 1));
    eq(nextRepeatDate("weekly", base), shiftISO(base, 7));
    eq(nextRepeatDate("monthly", "2099-01-31"), "2099-02-28");
    // Ticked off long after it was due, the next one still lands in the future.
    const was = shiftISO(T(), -30), late = nextRepeatDate("weekly", was);
    ok(late > T() && late <= shiftISO(T(), 7), "weekly from " + was + " gave " + late);
  });
  test("parseRule <-> formatRule", () => {
    for (const s of ["every weekday", "weekly on mon, thu", "monthly on the 15th", "monthly on the last friday", "every 2 weeks"])
      eq(formatRule(parseRule(formatRule(parseRule(s)))), formatRule(parseRule(s)), s);
    eq(formatRule(parseRule("every weekday")), "every weekday");
    eq(parseRule("now and then"), null);
  });

  /* ============================================================
     Tasks: capture, state, undo
     ============================================================ */
  test("captureLine puts a TODO on today's journal with its date and context", () => {
    const made = captureLine("Ring the tyre shop @phone tomorrow");
    ok(made, "nothing captured");
    eq(made.path, journalPath(T()));
    eq(made.block.state, "TODO");
    has(made.block.title, "[[c/phone]]");
    has(JSON.stringify(made.block.props), shiftISO(T(), 1), "scheduled tomorrow");
    ok(getPage(made.path).blocks.includes(made.block), "on the page");
  });
  test("setBlockState to DONE, and undo puts it back", () => {
    const path = scratchProject("state", [["TODO", "Finish the thing"]]);
    const b = getPage(path).blocks[0];
    setBlockState(path, b, "DONE");
    eq(getPage(path).blocks[0].state, "DONE");
    undoLast();
    eq(getPage(path).blocks[0].state, "TODO");
    if (typeof closeModal === "function") closeModal();
  });
  test("cycleState walks TODO -> DOING -> WAIT -> DONE", () => {
    const path = scratchProject("cycle", [["TODO", "Cycle me"]]);
    const seen = [];
    for (let i = 0; i < 3; i++) {
      cycleState(path, getPage(path).blocks[0]);
      seen.push(getPage(path).blocks[0].state);
      if (typeof closeModal === "function") closeModal();
    }
    eq(seen, ["DOING", "WAIT", "DONE"]);
  });
  test("urgencyOf gives a number for every open action", () => {
    const acts = allLeafActions();
    ok(acts.length > 10, "only " + acts.length + " actions in the demo");
    for (const a of acts) ok(Number.isFinite(urgencyOf(a)), "urgency of " + a.block.title);
  });

  /* ============================================================
     Pages and links
     ============================================================ */
  test("putPage / getPage / removePage", () => {
    const path = join(DIRS.pages, "Test scratch page.md");
    putPage(path, {props: {title: "Test scratch page"}, blocks: [newBlock({title: "hello"})]});
    eq(getPage(path).blocks[0].title, "hello");
    removePage(path);
    eq(getPage(path), undefined);
  });
  test("backlinks find the tasks that name a person", () => {
    const hits = backlinksTo(personPath("Lars Haugen"));
    ok(hits.length >= 1, "no backlinks to Lars Haugen");
  });
  test("renamePage rewrites the links to it", () => {
    const target = join(DIRS.pages, "Test rename me.md");
    putPage(target, {props: {title: "Test rename me"}, blocks: []});
    const from = scratchProject("links", [["TODO", "Read [[Test rename me]]"]]);
    const to = renamePage(target, "Test renamed");
    ok(to !== target, "path did not change");
    ok(getPage(to), "no page at the new path");
    has(getPage(from).blocks[0].title, "Test renamed");
    if (typeof closeModal === "function") closeModal();
  });

  /* ============================================================
     Mail, pastes, notes and reviews
     ============================================================ */
  test("parseEmailText reads an Outlook mail", () => {
    const m = parseEmailText([
      "From: Lars Haugen <lars@nordvik.no>",
      "Sent: Monday, 26 October 2026 09:12",
      "To: Kenneth Aar",
      "Subject: Depot users",
      "",
      "Hi Kenneth,",
      "",
      "Here is the list.",
      "",
      "Lars",
    ].join("\n"));
    ok(m, "not read as a mail");
    eq(m.name, "Lars Haugen");
    eq(m.email, "lars@nordvik.no");
    eq(m.subject, "Depot users");
    has(m.body.join("\n"), "Here is the list.");
  });
  test("a pasted review becomes an r/ page", () => {
    const made = saveReviewPage("Dune\nGreat world building.\nSlow middle.", "book");
    ok(made.path.startsWith(DIRS.reviews + "/"), made.path);
    eq(pageKind(made.path), "review");
    eq(getPage(made.path).props.medium, "book");
  });
  test("a pasted note becomes a page", () => {
    const made = saveNotePage("Meeting thoughts\nFirst point\nSecond point");
    ok(made && getPage(made.path), "no page made");
  });

  /* ============================================================
     Sharing
     ============================================================ */
  test("an invite carries the area and reads back", () => {
    const text = inviteMarkdown();
    const cfg = parseInvite(text);
    ok(cfg, "parseInvite gave nothing");
    eq(cfg.space, "Work");
    eq(cfg.from, "Kenneth Aar");
    has(text, "gtd:file " + personPath("Lars Haugen"));
    eq(parseInvite("just some text"), null);
  });

  /* ============================================================
     Timer
     ============================================================ */
  test("timer starts and stops", () => {
    timerStart(5, false);
    ok(TIMER_END > Date.now(), "TIMER_END not in the future");
    timerStop();
    eq(TIMER_END, 0);
  });

  /* ============================================================
     The runner
     ============================================================ */
  async function run(only = "") {
    const results = [];
    for (const t of tests) {
      if (only && !t.name.toLowerCase().includes(only.toLowerCase())) continue;
      try { await t.fn(); results.push({name: t.name, ok: true}); }
      catch (e) { results.push({name: t.name, ok: false, error: e && e.stack ? e.stack.split("\n").slice(0, 3).join("\n") : String(e)}); }
    }
    go("today");
    return results;
  }
  return {run, tests};
})();
