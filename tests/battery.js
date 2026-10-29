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
    clearMemo();          // putPage, unlike an edit, leaves the lists as a render before it saw them
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
  test("#166 the projects list draws no stray null", async () => {
    go("projects", {sub: "list", statusCode: "1"});
    await settle();
    ok(![...content().childNodes].some(n => n.nodeType === 3 && n.textContent === "null"), "a bare null is drawn");
  });
  test("#166 projects list: search, filter and sort in one bar, the statuses in a row of their own", async () => {
    go("projects", {sub: "list", statusCode: "1"});
    await settle();
    const bar = content().querySelector(".projbar");
    ok(bar, "no projects bar");
    ok(bar.querySelector(".searchbox svg") && bar.querySelector(".searchbox input[type=search]"), "no search box with its icon");
    ok(bar.querySelector(".fchips .fchip[aria-pressed=true]"), "no status chips row");
    eq(bar.querySelectorAll(".sheetbtn").length, 2, "filter and sort buttons");
    ok(content().querySelector(".fab[aria-label='New project']"), "no round New project button");
    ok(content().querySelector(".vsel select"), "no view dropdown");
  });
  test("#166 the filter sheet sets the organisation and counts it on the button", async () => {
    try {
      go("projects", {sub: "list", statusCode: "1", org: null});
      await settle();
      content().querySelector(".projbar .sheetbtn").click();
      const opt = [...document.querySelectorAll("#modalRoot .sheetopt")].find(b => b.textContent === "Havbris Seafood");
      ok(opt, "no organisation choices in the sheet");
      opt.click();
      await settle();
      eq(state.org, "Havbris Seafood");
      eq(document.querySelector("#modalRoot .sheetopt[aria-pressed=true]")?.textContent, "Havbris Seafood", "the sheet shows the choice");
      closeModal();
      eq(content().querySelector(".projbar .sheetbtn small")?.textContent, "1", "badge");
    } finally { closeModal(); go("projects", {org: null}); await settle(); }
  });
  test("#166 the sort sheet sets the order", async () => {
    const was = PREF.get("projects.sort", "urgency");
    try {
      go("projects", {sub: "list", statusCode: "1"});
      await settle();
      content().querySelectorAll(".projbar .sheetbtn")[1].click();
      [...document.querySelectorAll("#modalRoot .sheetopt")].find(b => b.textContent === "By name, Z-A, 9-1").click();
      eq(PREF.get("projects.sort"), "za");
      ok(!document.querySelector("#modalRoot .modal"), "the sheet stays open");
    } finally { PREF.set("projects.sort", was); closeModal(); }
  });
  test("#166 the view dropdown switches the reading", async () => {
    go("projects", {sub: "list"});
    await settle();
    const s = content().querySelector(".vsel select");
    s.value = "board";
    s.dispatchEvent(new Event("change"));
    await settle();
    eq(subNow(), "board");
    go("projects", {sub: "list"});
    await settle();
  });
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

  test("#164 an area kept in a folder that opens without it says so", async () => {
    const b = await spaceBackend({name: "No folder here", kind: "fs"});
    ok(b.kind !== "fs", "a folder backend with no folder");
    ok(LOST_FOLDER.has("No folder here"), "not marked as without its folder");
    LOST_FOLDER.delete("No folder here");
  });
  test("#164 a lost folder asks to be picked again, and the sync status says so", async () => {
    LOST_FOLDER.add(V.space);
    try {
      setSync("ok", V.backend.label);
      eq(document.querySelector("#syncTxt").textContent, "folder not connected");
      ok(document.querySelector("#syncDot").classList.contains("warn"), "the dot does not warn");
      if (CAP.dirPicker) {
        offerFolderBack(V.space);
        await settle();
        has(document.querySelector("#modalRoot .modal").textContent, "folder");
        ok([...document.querySelectorAll("#modalRoot button")].some(x => x.textContent.startsWith("Pick ")), "no Pick button");
      }
    } finally {
      LOST_FOLDER.delete(V.space);
      for (let i = 0; i < 4 && $("#modalRoot").firstChild; i++) closeModal();
      setSync("ok", V.backend.label);
    }
  });

  /* ============================================================
     Sending an update: the check-in sheet the other way round (#153)
     ============================================================ */
  const closeAll = () => { for (let i = 0; i < 4 && $("#modalRoot").firstChild; i++) closeModal(); };
  const modalTitle = () => (document.querySelector("#modalRoot .modal") || {textContent: ""}).textContent;
  test("#153 /inform is a slash command", () => {
    ok(slashRows("inform").some(r => r.id === "inform"), "no /inform");
    ok(slashRows("oppdater").some(r => r.id === "inform"), "not found by oppdater");
  });
  test("#153 informAbout finds my open tasks that name them", () => {
    const path = scratchProject("inform about", [["TODO", "Call [[p/Lars Haugen]] about the depot"], ["DONE", "Met [[p/Lars Haugen]]"]]);
    const hits = informAbout({name: "Lars Haugen"}).filter(a => a.path === path);
    eq(hits.length, 1, "open tasks naming Lars in the scratch project");
  });
  test("#153 /inform on a line naming one person opens Send {name} an update, that line ticked", async () => {
    const path = scratchProject("inform line", [["DOING", "Quote for [[p/Lars Haugen]]"], ["TODO", "Ring [[p/Lars Haugen]] back"]]);
    informFromLine(path, getPage(path).blocks[0]);
    await settle();
    has(modalTitle(), "Send Lars Haugen an update");
    const ticks = [...document.querySelectorAll("#modalRoot .spacetoggle")].filter(b => b.style.width !== "16px");
    ok(ticks.length >= 2, "both lines offered");
    eq(ticks.filter(b => b.classList.contains("on")).length, 1, "only the line it started from is ticked");
    closeAll();
  });
  test("#153 /inform on a line naming nobody offers a search, and the pick is linked on the line", async () => {
    const path = scratchProject("inform nobody", [["TODO", "Send the drawings"]]);
    const b = getPage(path).blocks[0];
    informFromLine(path, b);
    await settle();
    has(modalTitle(), "Send an update to");
    has(modalTitle(), "Lars Haugen", "people offered");
    has(modalTitle(), "Nordvik Shipping", "organisations offered");
    closeAll();
    // What the search hands back is linked on the line.
    blockLinkAdd({space: V.space, path, block: b}, "p/Lars Haugen");
    eq(inSpace(V.space, () => linePeople(b)), ["Lars Haugen"]);
  });
  test("#153 the mail and the sheet carry each line's status and comment", () => {
    const items = [{t: "Quote for the depot", status: "DOING", core: "DOING", comment: "Waiting on board approval 12 Nov",
      project: "Secret project", context: [{depth: 0, text: "two options"}]}];
    const was = PREF.get("askLang", "");
    PREF.set("askLang", "en");
    try {
      const note = informNote("Lars Haugen", "Kenneth Aar", items, null, false);
      has(note.subject, "Quote for the depot");
      has(note.body, "Status: In progress");
      has(note.body, "Waiting on board approval 12 Nov");
      has(note.body, "- two options");
      ok(!note.body.includes("Secret project"), "project named without being asked to");
      ok(informNote("Lars Haugen", "Kenneth Aar", items, null, true).body.includes("Secret project:"), "project not named when asked to");
      const html = informSheetHtml({to: "Lars Haugen", from: "Kenneth Aar", items, named: false});
      has(html, "Hi Lars");
      has(html, "In progress");
      has(html, "Waiting on board approval 12 Nov");
      ok(!html.includes("Secret project"), "sheet names the project");
      ok(!/<script/i.test(html), "the sheet is read-only, no script");
      PREF.set("askLang", "no");
      has(informNote("Lars Haugen", "Kenneth Aar", items, null, false).body, "Status: Pågår");
    } finally { PREF.set("askLang", was); }
  });
  test("#153 sent lines get informed::, a Told line in the chat, and Undo takes it back", () => {
    const path = scratchProject("inform sent", [["TODO", "Draft for [[p/Lars Haugen]]"]]);
    const b = getPage(path).blocks[0];
    const r = {a: {path, block: b, space: V.space, title: b.title}, was: "TODO"};
    informSent("Lars Haugen", [r], [{status: "TODO", comment: "Starting Monday"}]);
    const blk = getPage(path).blocks[0];
    has(blockProp(blk, INFORMED_PROP), "Lars Haugen");
    eq(informedDays(blk), 0);
    const msgs = messagesOf(blk);
    eq(msgs.length, 1, "messages");
    eq(msgs[0].title, "Told Lars Haugen: Not started. Starting Monday");
    undoLast();
    ok(!blockProp(getPage(path).blocks[0], INFORMED_PROP), "informed:: still there after undo");
    closeAll();
  });
  test("#153 a status changed in the update goes to the task once confirmed", async () => {
    const path = scratchProject("inform status", [["TODO", "Order for [[p/Lars Haugen]]"]]);
    const b = getPage(path).blocks[0];
    informSent("Lars Haugen", [{a: {path, block: b, space: V.space, title: b.title}, was: "TODO"}], [{status: "DOING", comment: ""}]);
    await settle();
    has(modalTitle(), "Change the tasks too?");
    eq(getPage(path).blocks[0].state, "TODO", "changed before confirming");
    [...document.querySelectorAll("#modalRoot button")].find(x => x.textContent === "Change them").click();
    eq(getPage(path).blocks[0].state, "DOING");
    closeAll();
  });

  /* ============================================================
     Stakeholders on responsibilities (#158)
     ============================================================ */
  let respN = 0;
  // A responsibility of the test's own, with stakeholder:: and a project under it.
  const scratchResp = (stake, tasks = []) => {
    const title = "Test Resp " + (++respN);
    const area = createArea(title);
    getPage(area).props.stakeholder = stake;
    touch(area);
    const proj = scratchProject("under " + title, tasks);
    setAreaOfProject(proj, baseName(area));
    return {area, proj, name: baseName(area)};
  };
  test("#158 stakeholder:: on a responsibility is read, people and organisations", () => {
    const {area} = scratchResp("[[p/Lars Haugen]], [[o/Nordvik Shipping]]");
    eq(stakeholdersOfArea(area), [{name: "Lars Haugen", org: false}, {name: "Nordvik Shipping", org: true}]);
    getPage(area).props = {title: getPage(area).props.title, stakeholders: "[[p/Emma Dahl]]"};
    eq(stakeholdersOfArea(area).map(s => s.name), ["Emma Dahl"], "stakeholders:: read too");
  });
  test("#158 an organisation stakeholder is not a client of the projects under it", () => {
    const {area, proj} = scratchResp("[[o/Nordvik Shipping]]");
    eq(areaOrgsOf(proj), [], "stakeholder taken for a client");
    getPage(area).props.org = "[[o/Nordvik Shipping]]";
    eq(areaOrgsOf(proj), ["Nordvik Shipping"], "org:: on the responsibility still counts");
  });
  test("#158 a project reads as status, next action, done since, late and waiting", () => {
    const {proj} = scratchResp("[[p/Lars Haugen]]", [["TODO", "Write the brief"], ["TODO", "Book the room"], ["WAIT", "Quote from the printer"], ["TODO", "Old thing"]]);
    const b = getPage(proj).blocks;
    setBlockState(proj, b[1], "DONE");
    setDue(b[3], shiftISO(T(), -3)); touch(proj);
    closeAll();
    const s = projectSummary(V.space, proj, shiftISO(T(), -30));
    eq(s.code, "1");
    const lines = s.lines.map(l => l.label + " " + l.text);
    ok(lines.some(l => l.startsWith("next ")), "no next action: " + lines);
    ok(lines.includes("done Book the room"), "done since: " + lines);
    ok(lines.includes("late Old thing"), "late: " + lines);
    ok(lines.includes("wait Quote from the printer"), "waiting: " + lines);
    eq(projectSummary(V.space, proj, shiftISO(T(), 1)).lines.filter(l => l.label === "done").length, 0, "done before the last update counted");
  });
  test("#158 Send {name} an update offers the responsibilities they are a stakeholder in", async () => {
    const {name} = scratchResp("[[p/Lars Haugen]]", [["TODO", "Draft the budget"]]);
    ok(stakeIn({name: "Lars Haugen"}).some(a => baseName(a.path) === name), "stakeIn misses it");
    openSendUpdate({name: "Lars Haugen"});
    await settle();
    has(modalTitle(), "Send Lars Haugen an update");
    has(modalTitle(), getPage(areaPathOf(name)).props.title || name);
    has(modalTitle(), "responsibility");
    closeAll();
  });
  test("#158 the mail heads each responsibility and labels the summary's lines", () => {
    const was = PREF.get("askLang", "");
    PREF.set("askLang", "en");
    try {
      const items = [
        {t: "Budget 2027", status: "P:1", core: "DOING", head: "Finance", context: [{depth: 0, label: "next", text: "Draft the budget"}]},
        {t: "Call about the depot", status: "TODO", head: "\u0001other", context: []}];
      const body = informNote("Lars Haugen", "Kenneth Aar", items, null, false).body;
      has(body, "Finance:");
      has(body, "Status: Active");
      has(body, "- Next: Draft the budget");
      has(body, "Other:");
      has(informSheetHtml({to: "Lars Haugen", from: "Kenneth Aar", items, named: false}), "Next: Draft the budget");
    } finally { PREF.set("askLang", was); }
  });
  test("#158 telling a stakeholder stamps told:: and logs it on the responsibility, Undo takes it back", () => {
    const {area, proj} = scratchResp("[[p/Lars Haugen]]", [["TODO", "Draft the budget"]]);
    const a = {space: V.space, path: area, title: "R"};
    const r = {kind: "proj", area: a, p: {code: "1", title: pageTitle(proj)}};
    informSent("Lars Haugen", [r], [{t: "Budget", status: "P:1", comment: "On track"}], {name: "Lars Haugen"});
    eq(toldOn(area, {name: "Lars Haugen"}), T());
    const log = getPage(area).blocks.find(b => plainTitle(b.title) === "Updates sent");
    ok(log, "no Updates sent line");
    has(log.children[0].title, "Told [[p/Lars Haugen]]: Budget (Active): On track");
    undoLast();
    eq(toldOn(area, {name: "Lars Haugen"}), null);
    closeAll();
  });
  test("#158 a stakeholder is due once their rhythm has passed, never if they said never", () => {
    const who = {name: "Test Stakeholder " + Date.now()};
    const {area} = scratchResp("[[p/" + who.name + "]]", [["TODO", "Something"]]);
    clearMemo();
    ok(stakeholdersDue().some(d => sameStake(d, who)), "never told is not due");
    setToldOn(area, who, nowStamp()); clearMemo();
    ok(!stakeholdersDue().some(d => sameStake(d, who)), "told today is due");
    setToldOn(area, who, shiftISO(T(), -40) + "T09:00:00Z"); clearMemo();
    ok(stakeholdersDue().some(d => sameStake(d, who)), "40 days with the monthly default is not due");
    setUpdateEvery(who, "3 months"); clearMemo();
    ok(!stakeholdersDue().some(d => sameStake(d, who)), "every 3 months, told 40 days ago, is due");
    setUpdateEvery(who, "never"); clearMemo();
    ok(!stakeholdersDue().some(d => sameStake(d, who)), "never is due");
  });
  test("#158 Notify on a finished project offers the responsibility's stakeholders", () => {
    const {proj} = scratchResp("[[p/Lars Haugen]], [[o/Nordvik Shipping]]");
    const names = stakeholdersOf(V.space, proj).map(s => s.name);
    ok(names.includes("Lars Haugen") && names.includes("Nordvik Shipping"), "got " + names);
  });
  test("#158 the responsibility page lists its stakeholders, the person page says what they follow", async () => {
    const {area} = scratchResp("[[p/Lars Haugen]]", [["TODO", "Something"]]);
    openPage(area);
    await settle();
    has(content().textContent, "Stakeholders");
    has(content().textContent, "+ stakeholder");
    openPage(personPath("Lars Haugen"));
    await settle();
    has(content().textContent, "Stakeholder in");
    go("today");
  });

  /* ============================================================
     The update mail, both directions (#159)
     ============================================================ */
  const inEnglish = fn => { const was = PREF.get("askLang", ""); PREF.set("askLang", "en"); try { return fn(); } finally { PREF.set("askLang", was); } };
  const REF_LINE = refs => "Reference (leave as is): " + refs.join(" ");
  test("#159 the update mail is numbered, has a link on each line and Got it, and no sign-off", () => inEnglish(() => {
    const m = updateMail({mode: "inform", them: "Lars Haugen", subject: "Update", replyTo: "me@example.com", greet: "Hi Lars,", ack: true,
      items: [{ref: "Work-aaaa1111", t: "Quote for the depot", word: "In progress", color: MAIL_COLOR.DOING, comment: "Board on 12 Nov",
               context: [{depth: 0, text: "two options"}]},
              {ref: "Work-bbbb2222", t: "Old badges", word: "Cancelled", color: MAIL_COLOR.CANCELLED, struck: true}]});
    has(m.html, "1.</span> Quote for the depot");
    has(m.html, "2.</span> Old badges");
    has(m.html, REF_LINE(["Work-aaaa1111", "Work-bbbb2222"]));
    has(m.html, "Board on 12 Nov");
    has(m.html, "two options");
    has(m.html, "line-through", "a cancelled line is struck through");
    has(m.html, "Powered by");
    ok(!/background:#[c-f]/i.test(m.html), "a light fill behind text turns grey in Outlook's dark mode");
    ok(!/Best regards/.test(m.html + m.text), "the mail signs off; their own signature does that");
    eq(m.links.length, 3, "one Ask about this per line and one Got it");
    ok(m.links.every(l => l.length < 2000 && l.startsWith("mailto:me@example.com?")), "links too long or not to me");
    has(decodeURIComponent(m.links[0]), "\r\n--\r\n1: Quote for the depot\r\n");
    const got = decodeURIComponent(m.links[2]);
    has(got, "body=Got it, thanks.");
    has(got, "\r\n--\r\nGot it\r\n");
    has(m.text, "1. Quote for the depot");
  }));
  test("#159 asking, each line gets Mark as done and Write about it, a question Answer this", () => inEnglish(() => {
    const m = updateMail({mode: "ask", them: "Lars Haugen", subject: "Waiting for", replyTo: "me@example.com", greet: "Hi Lars,",
      items: [{ref: "Work-aaaa1111", kind: "wait", t: "The signed contract", word: "Waiting for", color: MAIL_COLOR.wait},
              {ref: "Work-bbbb2222", kind: "question", t: "Which week works?", word: "Question", color: MAIL_COLOR.question}]});
    has(m.html, "Mark as done");
    has(m.html, "Write about this");
    has(m.html, "Answer this");
    ok(!m.html.includes("Got it"), "no Got it when asking");
    has(m.html, REF_LINE(["Work-aaaa1111", "Work-bbbb2222?"]), "a question's reference ends in ?");
    has(decodeURIComponent(m.links[0]), "1 done: The signed contract");
  }));
  test("#159 a reply typed by hand is read by its numbers", () => {
    const d = parseUpdateReply("Hi Kenneth\n\n1 done\n2: week 47, Tuesday\n3: next Friday\n\nLars\n\n> Hi Lars,\n> " +
      REF_LINE(["Work-aaaa1111", "Work-bbbb2222?", "Work-cccc3333"]));
    eq(d.items.map(i => [i.ref, i.done, i.note, !!i.answered]),
      [["Work-aaaa1111", true, "", false], ["Work-bbbb2222", true, "week 47, Tuesday", true], ["Work-cccc3333", false, "next Friday", false]]);
    eq(d.loose, "", "the greeting and the name are not about a task");
  });
  test("#159 a clicked reply: the words above the -- go to the task its footer names", () => {
    const r = REF_LINE(["Work-aaaa1111", "Work-bbbb2222"]);
    const d = parseUpdateReply("Which supplier is the second one?\n\n\n--\n2: Quote for the chairs\n" + r);
    eq(d.items.map(i => [i.ref, i.done, i.note]), [["Work-bbbb2222", false, "Which supplier is the second one?"]]);
    const done = parseUpdateReply("Signed copy attached.\n\n--\n1 done: The contract\n" + r);
    eq(done.items.map(i => [i.ref, i.done, i.note]), [["Work-aaaa1111", true, "Signed copy attached."]]);
  });
  test("#159 Got it is Got it for every line, and words added to it are kept", () => {
    const r = REF_LINE(["Work-aaaa1111", "Work-bbbb2222"]);
    const d = parseUpdateReply("Got it, thanks.\n\n\n--\nGot it\n" + r);
    eq(d.items.map(i => [i.ref, !!i.ack]), [["Work-aaaa1111", true], ["Work-bbbb2222", true]]);
    eq(d.loose, "");
    eq(parseUpdateReply("Got it, thanks. Lunch is on me.\n\n\n--\nGot it\n" + r).loose, "Lunch is on me.");
    eq(parseUpdateReply("Thanks!\n\nLars\n> " + r).items.filter(i => i.ack).length, 2, "a plain thanks is Got it");
  });
  test("#159 replies in the older formats still import", () => {
    const d = parseUpdateReply("---\n1. [x] Send the contract\n   Comment: signed\n\n   Reference (leave as is): Work-zzzz9999\n---");
    eq(d.items.map(i => [i.ref, i.done, i.note]), [["Work-zzzz9999", true, "signed"]]);
  });
  test("#159 Got it stamps acknowledged::, done on a task you told them closes nothing, done on one you asked closes it", async () => {
    const path = scratchProject("update mail ack", [["DOING", "Quote for [[p/Lars Haugen]]"], ["WAIT", "Contract from [[p/Lars Haugen]]"]]);
    const [a, b] = getPage(path).blocks;
    const ra = V.space + "-" + ensureBlockId(path, a), rb = V.space + "-" + ensureBlockId(path, b);
    setBlockProp(b, ASKED_PROP, "Kenneth Aar " + nowStamp());
    openUpdateArrived(parseUpdateReply("1 done\n2 done\n\n> " + REF_LINE([ra, rb])));
    await settle();
    [...document.querySelectorAll("#modalRoot button")].find(x => x.textContent.startsWith("Apply")).click();
    const [a2, b2] = getPage(path).blocks;
    ok(blockProp(a2, ACK_PROP), "no acknowledged:: on the task you told them about");
    eq(ackedDays(a2), 0);
    eq(a2.state, "DOING", "their done closed your own task");
    eq(b2.state, "DONE", "their done did not close what you asked about");
    closeAll();
  });
  test("#159 words with no number go to the task you pick, the only one by itself", async () => {
    const path = scratchProject("update mail loose", [["DOING", "Plan for [[p/Lars Haugen]]"]]);
    const a = getPage(path).blocks[0];
    const ra = V.space + "-" + ensureBlockId(path, a);
    openUpdateArrived(parseUpdateReply("Sounds good, but call me first.\n\nLars\n\n> " + REF_LINE([ra])));
    await settle();
    [...document.querySelectorAll("#modalRoot button")].find(x => x.textContent.startsWith("Apply")).click();
    eq(messagesOf(getPage(path).blocks[0]).map(m => m.title), ["Sounds good, but call me first."]);
    closeAll();
  });
  test("#159 a linked email reads as its subject, without the m/", () => {
    eq(plainTitle("Svar om [[m/Forespørsel om revisjonsrapport – MEPS 3]]"), "Svar om Forespørsel om revisjonsrapport – MEPS 3");
  });
  test("#159 taking the name out of a question takes its 'fra' too", () => {
    const was = PREF.get("askLang", "");
    PREF.set("askLang", "no");
    try {
      const {ask} = askQuestionParts({title: "Venter på svar fra [[p/Lars Haugen]] om [[m/Forespørsel om revisjonsrapport – MEPS 3]]",
        project: "MEPS"}, "Lars Haugen");
      eq(ask, "Venter på svar om Forespørsel om revisjonsrapport – MEPS 3");
    } finally { PREF.set("askLang", was); }
  });
  test("#159 the send step offers Copy and open email, the plain text and the sheet second", async () => {
    openInformNote({name: "Lars Haugen"}, [{ref: V.space + "-x1", t: "Quote", status: "DOING", core: "DOING", comment: "", context: []}],
      {file: null, named: false, area: V.space, sheetOf: null, sent: null});
    await settle();
    const buttons = [...document.querySelectorAll("#modalRoot button")].map(x => x.textContent);
    ok(buttons.includes("Copy and open email"), "no Copy and open email: " + buttons);
    ok(buttons.includes("Plain-text mail") && buttons.includes("Copy text"), "the plain text went: " + buttons);
    eq(document.querySelector("#modalRoot .btn.primary").textContent, "Copy and open email");
    closeAll();
    openSendUpdate({name: "Lars Haugen"});
    await settle();
    eq(document.querySelector("#modalRoot .btn.primary").textContent, "Write the email");
    closeAll();
  });

  test("#163 Powered by GroupToDo stays in English in every language", () => {
    const was = PREF.get("askLang", "");
    try {
      for (const code of ["sv", "no", "da", "de"]) {
        PREF.set("askLang", code);
        const m = updateMail({mode: "inform", them: "Lars Haugen", subject: "Update", replyTo: "me@example.com", greet: "Hej,",
          items: [{ref: "Work-aaaa1111", t: "Quote", word: "x", color: MAIL_COLOR.DOING}]});
        has(m.html, "Powered by <a", code);
      }
    } finally { PREF.set("askLang", was); }
  });
  test("#162 the words for one and for more make one line with {one|more}", () => {
    eq(askOneMore(n => MAIL_WORDS.en.introAsk(0, n)), "I have {a quick question|%count% quick questions} for you.");
    eq(askOneMore(MAIL_WORDS.en.intro), "Here is a short update on the {task|%count% tasks} I said I would get back to you about.");
    eq(askOneMore(MAIL_WORDS.da.intro), "Her er en kort opdatering på {opgaven|de %count% opgaver}, jeg lovede at vende tilbage om.");
  });
  test("#162 Personalize text: the page has the email's words, and the email reads them", () => {
    const was = PREF.get("askLang", ""), base = PREF.get("askLangBase", "");
    const keep = [ASK_OWN_PATH, INFORM_OWN_PATH].map(p => [p, V.pages.has(p) ? structuredClone(getPage(p)) : null]);
    const partText = (path, part) => (getPage(path).blocks.find(b => plainTitle(b.title).toLowerCase() === part)?.children || [])
      .map(k => k.title).join("\n");
    const wait = [{ref: "Work-aaaa1111", kind: "wait", t: "The signed contract", word: "Waiting for", color: MAIL_COLOR.wait}];
    try {
      PREF.set("askLangBase", "en"); PREF.set("askLang", "own");
      // A page made before the email had parts of its own gets them, in the email's words.
      for (const [p] of keep) if (V.pages.has(p)) removePage(p);
      const old = askOwnPage();
      old.blocks = old.blocks.filter(b => !/^email:/i.test(plainTitle(b.title)));
      putPage(ASK_OWN_PATH, old);
      ensureAskOwn();
      eq(partText(ASK_OWN_PATH, "email: waiting for"), MAIL_WORDS.en.introAsk(2, 0));
      eq(plainTitle(getPage(ASK_OWN_PATH).blocks[1].title), "Email: waiting for", "in its place, after the greeting");
      const std = updateMail({mode: "ask", them: "Lars Haugen", subject: "S", replyTo: "me@example.com", greet: "Hi Lars,", items: wait});
      has(std.html, MAIL_WORDS.en.introAsk(1, 0));
      getPage(ASK_OWN_PATH).blocks[1].children = [newBlock({title: "Lars, %name%: where is this?"})];
      getPage(ASK_OWN_PATH).blocks.find(b => /^email: help/i.test(plainTitle(b.title))).children = [newBlock({title: "Just click."})];
      const mine = updateMail({mode: "ask", them: "Lars Haugen", subject: "S", replyTo: "me@example.com", greet: "Hi Lars,", items: wait});
      has(mine.html, "Lars, Lars: where is this?");
      has(mine.html, "Just click.");
      ok(!mine.html.includes(MAIL_WORDS.en.helpAsk), "the standard help went");
      // Telling, the same: the Inform note's email part is the mail's intro.
      ensureInformOwn();
      eq(partText(INFORM_OWN_PATH, "email: update"), askOneMore(MAIL_WORDS.en.intro));
      const told = updateMail({mode: "inform", them: "Lars Haugen", subject: "S", replyTo: "me@example.com", greet: "Hi Lars,", ack: true,
        items: [{ref: "Work-aaaa1111", t: "Quote", word: "In progress", color: MAIL_COLOR.DOING}]});
      has(told.html, MAIL_WORDS.en.intro(1));
      has(told.html, MAIL_WORDS.en.helpAck + " " + MAIL_WORDS.en.help);
    } finally {
      PREF.set("askLang", was); PREF.set("askLangBase", base);
      for (const [p, page] of keep) { if (V.pages.has(p)) removePage(p); if (page) putPage(p, page); }
    }
  });
  test("#161 Ask for an update can leave the projects unnamed", async () => {
    const path = scratchProject("secret depot plan", [["TODO", "Ask [[p/Lars Haugen]] which crane goes first"]]);
    const block = getPage(path).blocks[0], title = pageTitle(path);
    const was = PREF.get("askNameProjects", "1"), mail = emailOf(whoAmI(), V.space);
    try {
      PREF.set("askNameProjects", "1");
      openAskForUpdate("Lars Haugen", block);
      await settle();
      const row = [...document.querySelectorAll("#modalRoot span")].find(x => x.textContent === "Name the projects in what they get");
      ok(row, "no choice to name the projects");
      document.querySelector("#modalRoot input[type=email]").value = "me@example.com";
      row.previousElementSibling.click();
      eq(PREF.get("askNameProjects", "1"), "0", "the choice is remembered");
      [...document.querySelectorAll("#modalRoot button")].find(x => x.textContent === "Write the email").click();
      await settle();
      const note = document.querySelector("#modalRoot textarea").value;
      has(note, "Which crane goes first");
      ok(!note.includes(title), "the project is named: " + note);
    } finally {
      closeAll();
      PREF.set("askNameProjects", was);
      setEmailOf(whoAmI(), V.space, mail);
    }
  });

  /* ============================================================
     The Journal, an execution view (#160)
     ============================================================ */
  const journalDue = async (tasks, day = T()) => {
    const path = scratchProject("journal", tasks);
    for (const b of getPage(path).blocks) setDue(b, day);
    touch(path);
    PREF.set("today.tab", "due");
    go("today");
    await settle();
    return {path, blocks: getPage(path).blocks, row: b => content().querySelector('.task.jrow[data-id="' + b.id + '"]')};
  };
  test("#160 a Journal row: the project above, then the state, the context and the words", async () => {
    const {path, blocks, row} = await journalDue([["TODO", "Call Bob about the quote [[c/phone]]"]]);
    const r = row(blocks[0]);
    ok(r, "the row is under Due today & late");
    const kids = [...r.children].map(n => n.className.split(" ")[0]);
    eq(kids.slice(0, 4), ["t-eyebrow", "t-chk", "chip", "t-title"], "order");
    has(r.querySelector(".t-eyebrow").textContent, pageTitle(path));
    eq(r.querySelector(":scope > .chip.ctx").textContent, "@phone");
    ok(!r.querySelector(".t-title").textContent.includes("phone"), "the context is not said twice");
    eq(r.lastElementChild.classList.contains("t-menu"), true, "the row's ⋯ ends it");
    ok(!r.querySelector(".duepill"), "due today goes without saying under Due today");
  });
  test("#160 a context written inside the words stays there", async () => {
    const {blocks, row} = await journalDue([["TODO", "Ask Ann at the [[c/office]] about the keys"]]);
    const r = row(blocks[0]);
    ok(r.classList.contains("noctx"), "no context in front");
    eq(r.querySelector(".t-title .wikilink.ctx").textContent, "@office");
  });
  test("#160 a late row says Due yesterday", async () => {
    const {blocks, row} = await journalDue([["TODO", "Send the late figures"]], shiftISO(T(), -1));
    has(row(blocks[0]).querySelector(".duepill").textContent, "Due yesterday");
  });
  test("#160 the Due tab counts what is done today beside what is open", async () => {
    const {path, blocks} = await journalDue([["TODO", "Finish the first thing"], ["TODO", "Finish the second thing"]]);
    setBlockState(path, blocks[0], "DONE");
    go("today");
    await settle();
    has(content().querySelector(".ttab-due .tratio").textContent, "done");
    ok(content().querySelector(".donetoday"), "the done today row under the list");
  });
  test("#160 the Due tab pairs open with done before anything is done", async () => {
    await journalDue([["TODO", "Start the first thing"]]);
    const tab = content().querySelector(".ttab-due");
    ok(/\d+ open · \d+ done/.test(tab.querySelector(".tratio").textContent), "open beside done: " + tab.textContent);
    ok(tab.querySelector(".tratio .pbar"), "with its bar");
    ok(!tab.querySelector(".tcount"), "not a bare count");
  });
  test("#160 Next 7 days says how many are open in words", async () => {
    await journalDue([["TODO", "Plan the thing next week"]], shiftISO(T(), 2));
    has(content().querySelector(".ttab-week .tratio").textContent, " open");
    ok(!content().querySelector(".ttab-week .tcount"), "not a bare count");
  });
  test("#160 a day with no trackers says so, and + tracker waits but is in reach of Tab", () => {
    const path = "journals/2099_01_01.md";
    putPage(path, {props: {}, blocks: [newBlock({title: "Nothing here is tracked"})]});
    const box = el("div", {class: "tpanel"}, el("div", {class: "space-journal"}, dayTrackersBlock(path)));
    document.body.append(box);
    try {
      has(box.textContent, "Nothing tracked yet.");
      const add = box.querySelector(".trkadd");
      eq(getComputedStyle(add).opacity, "0", "waits for the pointer");
      ok(getComputedStyle(add).visibility !== "hidden", "Tab can still land on it");
      add.focus();
      eq(getComputedStyle(add).opacity, "1", "focused, it shows");
    } finally { box.remove(); }
  });
  test("#160 the journal's upkeep can be reached with Tab", async () => {
    go("today");
    await settle();
    const edit = content().querySelector(".jcard:not(.trkcol) .jhead .upkeep");
    ok(edit, "Edit Markdown is there");
    ok(getComputedStyle(edit).visibility !== "hidden", "not taken out of the tab order");
  });
  test("#160 on the day page a context at the end goes in front of the words, as written elsewhere", () => {
    const b = {state: "TODO", title: "Reply to Bob [[c/computer]]"};
    const lead = lineHtml(b, true), plain = lineHtml(b);
    ok(lead.indexOf("@computer") < lead.indexOf("Reply"), "in front on the Journal: " + lead);
    ok(plain.indexOf("@computer") > plain.indexOf("Reply"), "where written elsewhere: " + plain);
    const mid = lineHtml({state: "TODO", title: "Print it at the [[c/office]] for Ann"}, true);
    ok(mid.indexOf("@office") > mid.indexOf("Print"), "inside the words it stays: " + mid);
  });
  test("#160 the journal's title does not repeat the area its badge names", async () => {
    go("today");
    await settle();
    eq(content().querySelector(".jcard:not(.trkcol) .jtitle").textContent, "Journal");
    ok(content().querySelector(".jcard:not(.trkcol) .jhead .sp"), "the area's coloured badge stays");
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
