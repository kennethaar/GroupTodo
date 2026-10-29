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
  /* ============================================================
     The top bar
     ============================================================ */
  // The page is wide, so the bar is laid out again in a phone-wide frame
  // with the app's own styles.
  const phoneBar = async (width, meeting, context) => {
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:0;top:0;height:300px;border:0;width:" + width + "px";
    const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("\n");
    const bar = document.querySelector("header.top").cloneNode(true);
    const mt = bar.querySelector("#nextMeet"), cx = bar.querySelector("#btnContext");
    mt.hidden = !meeting; cx.hidden = !context;
    mt.className = "nextmeet now";
    mt.innerHTML = '<span class="ic">\u{1F552}</span><span class="t">Weekly sync with Nordvik</span><span class="w">' + (meeting || "") + "</span>";
    cx.innerHTML = "<span>@" + (context || "") + '</span><span class="x">\u00D7</span>';
    f.srcdoc = "<!doctype html><html data-theme=\"" + (document.documentElement.dataset.theme || "") + "\"><style>" + css + "</style><body>" + bar.outerHTML;
    document.body.append(f);
    await new Promise(r => f.onload = r);
    return {f, d: f.contentDocument};
  };
  test("#168 on a phone the capture field stays usable and the meeting time is not clipped", async () => {
    const {f, d} = await phoneBar(390, "now, until 20:30", "pc");
    try {
      const head = d.querySelector("header.top").getBoundingClientRect();
      const cap = d.querySelector(".capture").getBoundingClientRect();
      const meet = d.querySelector("#nextMeet"), mr = meet.getBoundingClientRect();
      const w = meet.querySelector(".w"), wr = w.getBoundingClientRect();
      ok(cap.width >= 110, "the capture field is " + Math.round(cap.width) + "px wide");
      ok(cap.height <= 44, "the capture field is " + Math.round(cap.height) + "px tall");
      ok(mr.top >= cap.bottom, "the meeting is on a row under the capture field");
      ok(wr.right <= mr.right + 0.5 && w.scrollWidth <= w.clientWidth + 0.5, "the meeting's time is clipped");
      const ctx = d.querySelector("#btnContext").getBoundingClientRect();
      ok(ctx.top >= cap.bottom && ctx.right <= head.right, "the @context is on the row under, inside the bar");
      ok(d.documentElement.scrollWidth <= 390, "the bar is wider than the phone");
    } finally { f.remove(); }
  });
  test("#168 on a phone with no meeting or context the bar is one row", async () => {
    const {f, d} = await phoneBar(390, null, null);
    try {
      eq(getComputedStyle(d.querySelector(".hnow")).display, "none", "the empty row");
      ok(d.querySelector("header.top").getBoundingClientRect().height < 70, "the bar is one row");
    } finally { f.remove(); }
  });
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
  test("#167 a project card says each thing once: stats row, bar under it, field lines, faces at the foot", async () => {
    const path = scratchProject("Card anatomy", [["TODO", "Call the printer"], ["DONE", "Book the hall"], ["DONE", "Send the invite"]]);
    const page = getPage(path);
    page.props.with = "[[p/Lars Haugen]]";
    page.props.org = "[[o/Nordvik Shipping]]";
    touch(path);
    go("projects", {sub: "list", statusCode: "1", org: null});
    await settle();
    const card = [...content().querySelectorAll(".pcard")].find(c => c.querySelector(".t-title").textContent.includes("Card anatomy"));
    ok(card, "no card for the project");
    const stats = card.querySelector(".pstats").textContent;
    has(stats, "1 open"); has(stats, "2 done");
    ok(!/Nordvik/.test(stats), "the organisation is said in the stats row as well as its line");
    eq(card.querySelector(".pprog .pct").textContent, "67%", "percentage beside the bar");
    ok(card.querySelector(".pstats").nextElementSibling.classList.contains("pprog"), "the bar is right under the numbers");
    const lines = [...card.querySelectorAll(".pfields.lines .pfield:not(.miss)")].map(x => x.textContent);
    ok(lines.some(t => t.includes("Nordvik Shipping")), "no organisations line");
    const icon = k => [...card.querySelectorAll(".pfields.lines .pfield")].find(x => x.title.startsWith(k))?.querySelector(".fi")?.textContent;
    eq(icon("Organisations"), ICON.orgs, "organisations use the sidebar's building");
    eq(icon("Next action"), ICON.next, "the next action uses the sidebar's lightning bolt");
    ok(lines.some(t => t.includes("“Call the printer”")), "no next action line");
    ok(!lines.some(t => t.includes("Lars")), "the people are a line of names as well as faces");
    ok(card.querySelector(".pfoot .avs .avatar"), "no faces at the foot");
    ok([...card.querySelectorAll(".pfoot button")].some(b => b.textContent === "View tasks"), "no View tasks button");
    const miss = card.querySelector(".pfield.miss");
    ok(miss && getComputedStyle(miss).display === "none", "empty fields show before the card is reached for");
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
  test("#176 a sum is written the way its currency is, not the browser's language", () => {
    eq(fmtPrice("DKK", 15000), "DKK 15.000");
    eq(fmtPrice("DKK", 3480.95), "DKK 3.480,95");
    eq(fmtPrice("NOK", 1200), "NOK 1 200");
    eq(fmtPrice("USD", 1234567.5), "USD 1,234,567.50");
    eq(fmtPrice("kr", 400), "400 kr");
    eq(fmtPrice("DKK", -15000), "DKK -15.000");
  });
  test("#176 a minus or brackets make a price negative; a range is not a minus", () => {
    const one = t => pricesIn(t).map(p => p.cur + " " + p.amount);
    eq(one("Refund DKK -15000"), ["DKK -15000"]);
    eq(one("Refund DKK (15000)"), ["DKK -15000"]);
    eq(one("Refund (15.000,50) DKK"), ["DKK -15000.5"]);
    eq(one("Credit −200 EUR"), ["EUR -200"]);
    eq(one("Paint DKK 15.000"), ["DKK 15000"]);
    eq(one("Quote 300-400 EUR"), ["EUR 400"]);
    eq(one("Call 3 people"), []);
  });
  test("#176 a project's Cost heading says spent / planned once, and a refund takes off", () => {
    const path = scratchProject("cost", [["DONE", "Paint DKK 15000"], ["DONE", "Refund DKK (2000)"],
      ["TODO", "Floor DKK 3000"], ["CANCELLED", "Roof DKK 90000"]]);
    const sec = projectCostSection(path);
    eq(sec.querySelector("h3 .n").textContent, "DKK 13.000 spent / DKK 3.000 planned");
    ok(!sec.textContent.includes("90.000"), "a cancelled task counts as neither");
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
  test("#169 on a phone a linked reference's lines get the card's width", async () => {
    const sec = backlinksSection(personPath("Lars Haugen"));
    ok(sec, "no linked references to Lars Haugen");
    sec.open = true;
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:0;top:0;height:600px;border:0;width:390px";
    const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("\n");
    f.srcdoc = "<!doctype html><html data-theme=\"" + (document.documentElement.dataset.theme || "") + "\"><style>" + css + "</style><body><main class=\"content\">" + sec.outerHTML;
    document.body.append(f);
    await new Promise(r => f.onload = r);
    try {
      const d = f.contentDocument;
      const entry = d.querySelector(".backlink-entry"), src = d.querySelector(".bl-src");
      const tree = d.querySelector(".backlink-subtree");
      ok(entry && src && tree, "no backlink entry");
      ok(tree.getBoundingClientRect().width >= entry.getBoundingClientRect().width - 30, "the lines are " + Math.round(tree.getBoundingClientRect().width) + "px wide");
      ok(src.getBoundingClientRect().bottom <= tree.getBoundingClientRect().top + 0.5, "the source page is not above the lines");
      eq(getComputedStyle(src).textTransform, "uppercase", "the source page is not an eyebrow");
      ok(d.documentElement.scrollWidth <= 390, "the section is wider than the phone");
    } finally { f.remove(); }
  });
  test("the toolbar at the foot moves, indents and turns the line being written into a task", async () => {
    const path = scratchProject("edit bar", [["TODO", "Alpha"], ["TODO", "Bravo"], ["TODO", "Charlie"]]);
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    const titles = () => getPage(path).blocks.map(b => b.title);
    openPage(path);
    await settle();
    const bravo = getPage(path).blocks[1];
    const bar = () => document.querySelector("#editBar");
    const press = async k => { bar().querySelector('[data-k="' + k + '"]').click(); await frame(); await frame(); };
    try {
      focusBlock(bravo.id);
      await frame();
      ok(bar() && !bar().hidden, "no toolbar while a line is being written");
      eq([...bar().querySelectorAll(".elb")].map(n => n.textContent),
        ["Up", "Down", "Outdent", "Indent", "Note", "Zettel", "Project", "Area", "Photo", "Image"]);
      await press("down");
      eq(titles(), ["Alpha", "Charlie", "Bravo"], "after down");
      ok(document.activeElement && document.activeElement.closest('.blk[data-id="' + bravo.id + '"]'), "the caret left the line");
      await press("up");
      eq(titles(), ["Alpha", "Bravo", "Charlie"], "after up");
      await press("in");
      eq(titles(), ["Alpha", "Charlie"], "after indent");
      eq(getPage(path).blocks[0].children.map(b => b.title), ["Bravo"], "indented under Alpha");
      await press("out");
      eq(titles(), ["Alpha", "Bravo", "Charlie"], "after outdent");
      await press("kind");
      eq(getPage(path).blocks[1].state, null, "Task/Note did not make it a note");
      eq(bar().querySelector('[data-k="kind"] .elb').textContent, "Task");
      document.activeElement.blur();
      await frame();
      ok(bar().hidden, "the toolbar stays after the line is let go");
    } finally { go("today"); }
  });
  test("#170 a toolbar move keeps the line where it was on the screen, caret in it", async () => {
    const path = scratchProject("edit bar scroll", Array.from({length: 60}, (_, i) => ["TODO", "Row " + i]));
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    openPage(path);
    await settle();
    const row = getPage(path).blocks[40];
    const txt = () => document.querySelector('.blk[data-id="' + row.id + '"] .txt');
    try {
      txt().scrollIntoView({block: "center"});
      focusBlock(row.id);
      await frame();
      const c = content(), top = txt().getBoundingClientRect().top;
      ok(c.scrollTop > 200, "the page did not scroll down to the line");
      for (const k of ["down", "in", "out", "up"]) {
        document.querySelector('#editBar [data-k="' + k + '"]').click();
        eq(document.activeElement, txt(), "the caret is not back in the line at once after " + k);
        await frame(); await frame();
        ok(Math.abs(txt().getBoundingClientRect().top - top) < 2, "after " + k + " the line moved on screen from " +
          Math.round(top) + " to " + Math.round(txt().getBoundingClientRect().top));
      }
    } finally { go("today"); }
  });
  test("#172 on a phone Enter on the last line brings the new line to the middle", async () => {
    const path = scratchProject("enter centre", Array.from({length: 60}, (_, i) => ["TODO", "Row " + i]));
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    const mm = window.matchMedia;
    window.matchMedia = q => q === "(pointer:coarse)" ? {matches: true} : mm.call(window, q);
    openPage(path);
    await settle();
    const last = getPage(path).blocks[59];
    try {
      focusBlock(last.id);
      await frame();
      const txt = document.querySelector('.blk[data-id="' + last.id + '"] .txt');
      txt.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true, cancelable: true}));
      await frame(); await frame();
      const nb = getPage(path).blocks[60];
      ok(nb, "Enter made no new line");
      const node = document.querySelector('.blk[data-id="' + nb.id + '"] .txt');
      eq(document.activeElement, node, "the caret is not in the new line");
      const c = content(), cr = c.getBoundingClientRect(), bar = document.querySelector("#editBar");
      const mid = (cr.top + cr.bottom - (bar && !bar.hidden ? bar.offsetHeight : 0)) / 2;
      const r = node.getBoundingClientRect(), at = r.top + Math.min(r.height, 40) / 2;
      ok(Math.abs(at - mid) < 4, "the new line is at " + Math.round(at) + ", the middle is " + Math.round(mid));
    } finally { window.matchMedia = mm; go("today"); }
  });
  test("#175 the line menu stops above a phone's keyboard and scrolls there", async () => {
    const path = scratchProject("fly keyboard", [["TODO", "Scroll the menu"]]);
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    // A phone with its keyboard up: the window keeps its height, the visible part halves.
    const kb = {offsetTop: 0, offsetLeft: 0, width: innerWidth, height: Math.round(innerHeight / 2),
      addEventListener() {}, removeEventListener() {}};
    Object.defineProperty(window, "visualViewport", {configurable: true, get: () => kb});
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    try {
      focusBlock(b.id);
      await frame();
      const txt = document.querySelector('.blk[data-id="' + b.id + '"] .txt');
      ok(txt.getBoundingClientRect().bottom < kb.height - 100, "the line is not above the keyboard");
      flySummon(txt);
      await frame();
      ok(FLY && FLY.box.isConnected, "the line menu did not open");
      const box = FLY.box;
      box.append(Object.assign(document.createElement("div"), {style: "height:3000px"}));
      flyPlace();
      const bar = document.querySelector("#editBar");
      const floor = kb.height - (bar && !bar.hidden ? bar.offsetHeight : 0);
      ok(box.getBoundingClientRect().bottom <= floor, "the menu ends at " + Math.round(box.getBoundingClientRect().bottom) +
        ", under the keyboard and toolbar from " + floor);
      ok(box.scrollHeight > box.clientHeight, "the menu does not scroll");
      box.scrollTop = 200;
      box.dispatchEvent(new Event("scroll"));
      await frame();
      eq(box.scrollTop, 200, "scroll position after the menu's own scroll");
    } finally {
      delete window.visualViewport;
      document.activeElement && document.activeElement.blur();
      go("today");
    }
  });
  test("#170 the toolbar's Image puts a picture in the line", async () => {
    const path = scratchProject("edit bar image", [["TODO", "Snap the whiteboard"]]);
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    try {
      focusBlock(b.id);
      await frame();
      const click = HTMLInputElement.prototype.click;
      let input = null;
      HTMLInputElement.prototype.click = function () { input = this; };
      try { document.querySelector('#editBar [data-k="image"]').click(); }
      finally { HTMLInputElement.prototype.click = click; }
      ok(input && input.type === "file" && input.accept === "image/*", "no image picker");
      const photo = document.querySelector('#editBar [data-k="photo"]');
      HTMLInputElement.prototype.click = function () { this.remove(); eq(this.getAttribute("capture"), "environment", "Photo is not the camera"); };
      try { photo.click(); } finally { HTMLInputElement.prototype.click = click; }
      const dt = new DataTransfer();
      dt.items.add(new File([new Uint8Array([137, 80, 78, 71])], "board.png", {type: "image/png"}));
      input.files = dt.files;
      input.dispatchEvent(new Event("change"));
      for (let i = 0; i < 50 && !/!\[board\.png\]\(assets\//.test(getPage(path).blocks[0].title); i++) await frame();
      has(getPage(path).blocks[0].title, "![board.png](assets/", "the line has no picture");
      ok(!input.isConnected, "the picker is left behind");
    } finally { go("today"); }
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
  test("#170 a photo is drawn again at most 1600 px, as a JPEG, before it is kept", async () => {
    const cv = document.createElement("canvas");
    cv.width = 3200; cv.height = 2400;
    const cx = cv.getContext("2d");
    for (let i = 0; i < 400; i++) { cx.fillStyle = "hsl(" + (i * 37 % 360) + ",70%,50%)"; cx.fillRect((i * 97) % 3200, (i * 61) % 2400, 160, 120); }
    const big = new File([await new Promise(r => cv.toBlob(r, "image/png"))], "IMG_0001.png", {type: "image/png"});
    const small = await shrinkPhoto(big);
    eq(small.type, "image/jpeg");
    eq(small.name, "IMG_0001.jpg");
    ok(small.size < big.size, "it did not get smaller");
    const bmp = await createImageBitmap(small);
    eq([bmp.width, bmp.height], [1600, 1200]);
    const text = new File(["not a picture"], "notes.txt", {type: "text/plain"});
    eq(await shrinkPhoto(text), text, "a file that is not a picture is kept as it came");
  });
  test("#170 the vault file carries the pictures: all from a phone, the last month's from a computer", async () => {
    const be = V.backend;
    ok(be && typeof be.putAsset === "function", "the demo area keeps no files");
    const stamp = d => d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-101500";
    const fresh = "assets/test-fresh-" + stamp(new Date()) + ".jpg", old = "assets/test-old-20200105-101500.jpg";
    const loose = "assets/test-unlinked-" + stamp(new Date()) + ".jpg";
    for (const p of [fresh, old, loose]) await be.putAsset(p, new Blob([new Uint8Array([255, 216, 255, p.length])], {type: "image/jpeg"}));
    const path = scratchProject("bundle pictures", [["TODO", "Board ![a](" + fresh + ")"], ["TODO", "Old board ![b](" + old + ")"]]);
    const pc = await bundleAssetsMarkdown(false), phone = await bundleAssetsMarkdown(true);
    has(pc, "<!-- gtd:asset " + fresh + " image/jpeg -->");
    ok(!pc.includes(old), "a computer sent a picture older than a month");
    has(phone, old, "a phone left an old picture behind");
    ok(!phone.includes(loose), "a picture no page links to went along");
    // Pages still read as before, with the pictures below them.
    const whole = bundleMarkdown() + "\n" + phone;
    ok(parseBundle(whole).has(path), "the pages are not in the vault file");
    // Read back on another device: a picture it lacks is kept, byte for byte.
    const moved = whole.split(fresh).join("assets/test-arrived-20261029-101500.jpg");
    eq(await mergeBundleAssets(moved), 1, "pictures kept");
    const got = await be.getAsset("assets/test-arrived-20261029-101500.jpg");
    ok(got, "the picture did not arrive");
    eq([...new Uint8Array(await got.arrayBuffer())], [255, 216, 255, fresh.length]);
    eq(got.type, "image/jpeg");
    eq(await mergeBundleAssets(moved), 0, "a picture it already has is kept twice");
    removePage(path);
  });
  test("#179 Send shows on a phone with no folder, and not on a phone that opens one", () => {
    const mm = window.matchMedia, be = V.backend, linked = LINKED;
    window.matchMedia = q => ({matches: /coarse/.test(q), media: q, addEventListener() {}, removeEventListener() {}});
    try {
      LINKED = null;
      V.backend = {kind: "local"};
      ok(phoneLike(), "a phone in browser storage has no Send");
      syncSendButton();
      ok(!document.querySelector("#btnSend").hidden, "the Send button is hidden");
      V.backend = {kind: "fs", label: "Phone"};
      ok(!phoneLike(), "a phone on a folder still has Send, though Chrome on Android opens folders");
      syncSendButton();
      ok(document.querySelector("#btnSend").hidden, "the Send button shows on a folder");
      V.backend = {kind: "local"};
      LINKED = {};
      ok(!phoneLike(), "a phone with a linked vault file still has Send");
      window.matchMedia = q => ({matches: false, media: q, addEventListener() {}, removeEventListener() {}});
      LINKED = null;
      ok(!phoneLike(), "a computer has Send");
    } finally {
      window.matchMedia = mm; V.backend = be; LINKED = linked;
      syncSendButton();
    }
  });
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
  test("#180 a tracker on the day has one menu, with edit and remove in it, not a bare cross", () => {
    const path = "journals/2099_01_02.md";
    putPage(path, {props: {"tracker-weight_k": "80"}, blocks: []});
    const box = dayTrackersBlock(path, {move: V.space});
    document.body.append(box);
    try {
      const btns = [...box.querySelectorAll(".trkx")];
      eq(btns.length, 1, "one button per tracker");
      eq(btns[0].textContent, "⋯");
      btns[0].click();
      const menu = document.querySelector(".modal").textContent;
      for (const w of ["When it comes round", "Rename", "Move to another area", "Remove from this day", "Stop tracking"])
        has(menu, w);
    } finally { closeModal(); box.remove(); }
  });
  test("#180 removing a tracker a template brings in can still be undone", () => {
    const path = "journals/2099_01_03.md", tpl = DIRS.lists + "/Test 180 every day.md";
    putPage(path, {props: {"tracker-weight_k": "80"}, blocks: []});
    putPage(tpl, {props: {"tracker-weight_k": ""}, blocks: []});
    document.querySelectorAll("#toasts > *").forEach(n => n.remove());
    try {
      ok(trackerTemplatesWith("weight").length, "a template brings it in");
      removeDayTracker(path, "tracker-weight_k");
      ok(!("tracker-weight_k" in getPage(path).props), "off the day");
      const toast = document.querySelector("#toasts > .toast:last-child");
      has(toast.textContent, "will put it on new days");
      const act = toast.querySelector(".act");
      eq(act && act.textContent, "Undo");
      act.click();
      eq(getPage(path).props["tracker-weight_k"], "80", "back");
    } finally { removePage(tpl); }
  });
  test("#180 on a phone last time's value goes under the boxes, not on top", () => {
    const css = [...document.styleSheets].flatMap(sh => { try { return [...sh.cssRules]; } catch (_) { return []; } })
      .filter(r => r.media && /max-width:\s*560px/.test(r.media.mediaText)).map(r => r.cssText).join(" ");
    ok(/\.pfact\s*>\s*\.prevval\s*\{[^}]*flex-basis:\s*100%/.test(css), "prevval takes its own line");
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
     Help: the full help, "This page" and Show me (#171)
     ============================================================ */
  const keyDown = key => document.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true}));
  const helpTexts = t => [t.what, t.hint, ...(t.steps || []).map(x => [].concat(x)[0]),
    ...(t.legend || []).map(l => l[1]), ...(t.more || []), ...(t.code || []).map(c => c[1])].filter(Boolean);
  const helpReset = () => { closeModal(); setHelp(false); helpMarks(false); HELP_Q = ""; };
  test("#171 every view in the sidebar and every sub-view has its own help topic", () => {
    const views = [...NAV_ITEMS.filter(it => it && it.id && it.id !== "timer").map(it => it.id), ...Object.keys(VIEWS)];
    for (const view of new Set(views)) {
      for (const sub of SUBS[view] ? SUBS[view].map(x => x[0]) : [null]) {
        const id = helpTopicOf(view, sub);
        ok(HELP[id].view === view && (HELP[id].sub || null) === sub, "no topic for " + view + (sub ? " / " + sub : ""));
      }
    }
    ok(HELP.timer, "the Timer has a topic");
  });
  test("#171 every topic is short, links only to topics that exist, and sits in a part", () => {
    for (const [id, t] of Object.entries(HELP)) {
      ok(HELP_PARTS.some(p => p[0] === t.part), id + " is in no part");
      ok(t.title && t.what, id + " has a title and what it is");
      ok((t.steps || []).length <= 6, id + " has more than 6 steps");
      const before = [t.what, ...(t.steps || []).map(x => [].concat(x)[0])].join(" ").split(/\s+/).length;
      ok(before <= 90, id + " is " + before + " words before its More fold");
      for (const s of t.see || []) ok(HELP[s], id + " links to a topic that is not there: " + s);
      for (const w of t.words || []) ok(w === w.toLowerCase() && !/\s/.test(w), id + ": search word " + w);
    }
  });
  test("#171 every topic reads easily: LIX under 30", () => {
    const lix = texts => {
      let words = 0, long = 0, sents = 0;
      for (const t of texts) {
        sents += Math.max(1, t.split(/[.!?:]+(?:\s|$)/).filter(x => /[A-Za-z]/.test(x)).length);
        for (const w of t.match(/[A-Za-zÀ-ÿ]+/g) || []) { words++; if (w.length > 6) long++; }
      }
      return words ? words / sents + 100 * long / words : 0;
    };
    const high = Object.entries(HELP).map(([id, t]) => [id, lix(helpTexts(t))]).filter(([, v]) => v >= 30);
    eq(high.map(([id, v]) => id + " " + v.toFixed(1)), []);
  });
  test("#171 all help text goes through the language file", () => {
    const known = new Set(LANG_CATALOG.s);
    const missing = [];
    for (const [id, t] of Object.entries(HELP))
      for (const x of [t.title, ...helpTexts(t), ...(t.keys || []).map(k => k[1])])
        if (!known.has(x.replace(/\s+/g, " "))) missing.push(id + ": " + x);
    eq(missing, [], "run python docs/build-language-catalog.py");
  });
  test("#171 every legend on a screen points at something on that screen", async () => {
    setHelp(false);
    const missing = [];
    for (const [id, t] of Object.entries(HELP)) {
      if (!t.view || t.view === "page" || t.view === "help" || t.view === "me" || !t.legend) continue;
      go(t.view, t.sub ? {sub: t.sub} : {});
      await settle();
      for (const [sel] of t.legend) if (!sel.startsWith("?") && !helpFind(sel)) missing.push(id + ": " + sel);
    }
    eq(missing, []);
  });
  test("#171 ? opens This page for the view and sub-view, and it follows a change of view", async () => {
    helpReset();
    go("next", {sub: "board"});
    await settle();
    keyDown("?");
    const pane = document.querySelector("#pagePane");
    ok(helpOpen() && !pane.hidden, "the pane is open");
    has(pane.textContent, "Next › Board");
    has(pane.textContent, "What you see");
    go("waiting", {sub: "list"});
    await settle();
    has(pane.textContent, "Waiting for › List");
    keyDown("Escape");
    ok(!helpOpen() && pane.hidden, "Esc closes it");
  });
  test("#171 Show me puts numbers on the screen that match the legend, and Esc takes them off", async () => {
    helpReset();
    go("next", {sub: "board"});
    await settle();
    keyDown("s");
    await settle();
    ok(helpOpen() && HELP_MARKS, "s opens This page with Show me on");
    const marks = [...document.querySelectorAll("#helpMarks .hmark")];
    ok(marks.length >= 4, "only " + marks.length + " numbers on the board");
    const legend = HELP["next-board"].legend;
    for (const m of marks) eq(m.title, legend[+m.dataset.n][1], "number " + m.textContent);
    eq(marks[0].textContent, "1");
    keyDown("Escape");
    ok(!HELP_MARKS && !document.querySelector("#helpMarks"), "Esc takes the numbers off");
    ok(helpOpen(), "and leaves the page's help open");
    keyDown("Escape");
    ok(!helpOpen(), "a second Esc closes it");
  });
  test("#171 while Show me is on, a click explains instead of acting", async () => {
    helpReset();
    go("next", {sub: "list"});
    await settle();
    helpMarks(true);
    const before = state.view;
    const seg = [...document.querySelectorAll("#content .vseg button")].find(b => b.textContent === "Board");
    seg.click();
    await settle();
    eq(state.view + "/" + subNow(), before + "/list", "the click did not switch to the board");
    ok(document.querySelector(".helpsay"), "it said what the thing is");
    helpReset();
  });
  test("#171 the full help has contents and search, and everyday words find the topic", async () => {
    helpReset();
    openHelp("start");
    await settle();
    eq(state.view, "help");
    ok(content().querySelector(".helptoc"), "contents");
    ok(content().querySelector("input.helpq"), "search field");
    eq(helpSearch("delegate")[0], "waiting-list");
    ok(helpSearch("recurring").includes("repeat"), "recurring finds Repeat and routines");
    ok(helpSearch("delegate").length < Object.keys(HELP).length, "search filters");
    const q = content().querySelector("input.helpq");
    q.value = "snooze";
    q.dispatchEvent(new Event("input"));
    has(content().querySelector(".helptoc").textContent, "Hold and until");
    q.value = "";
    q.dispatchEvent(new Event("input"));
  });
  test("#171 Back and Forward walk the help topics, and each topic has a link of its own", async () => {
    helpReset();
    openHelp("journal");
    openHelp("hold");
    await settle();
    has(content().textContent, "Hold and until");
    navGo(-1);
    await settle();
    eq(state.helpTopic, "journal");
    navGo(1);
    await settle();
    eq(state.helpTopic, "hold");
    eq(tourDestOf("Read [[go/help-repeat]]"), "help-repeat");
    eq(tourLabel("help-repeat"), "Repeat and routines");
    goTour("help-repeat");
    await settle();
    eq(state.helpTopic, "repeat");
  });
  test("#171 a topic can be read beside the view", async () => {
    helpReset();
    go("projects", {sub: "list"});
    helpBeside("hold");
    await settle();
    const pane = document.querySelector("#pagePane");
    ok(!pane.hidden, "the pane is open");
    has(pane.textContent, "Hold and until");
    eq(state.view, "projects", "the view stays");
    helpReset();
  });
  test("#171 a first-visit note shows once per view, and Settings turns them off", async () => {
    helpReset();
    const was = PREF.get("help.hints", "1");
    PREF.set("help.hints", "1");
    PREF.set("help.seen.contexts", "");
    PREF.set("help.seen.chat", "");
    go("contexts");
    await settle();
    const note = document.querySelector("#helpHint");
    ok(note, "the note is there on the first visit");
    has(note.textContent, HELP.contexts.hint);
    go("today");
    go("contexts");
    await settle();
    ok(!document.querySelector("#helpHint"), "not on the second visit");
    PREF.set("help.hints", "0");
    go("chat");
    await settle();
    ok(!document.querySelector("#helpHint"), "off in Settings, none shows");
    go("checklists");
    await settle();
    has(content().textContent, "First-visit notes");
    PREF.set("help.hints", was);
  });
  test("#171 the full help on a phone is one column with the contents behind a button", async () => {
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:0;top:0;height:700px;width:390px;border:0";
    const css = [...document.querySelectorAll("style")].map(x => x.textContent).join("\n");
    openHelp("start");
    await settle();
    f.srcdoc = "<!doctype html><style>" + css + "</style><body><div id=\"content\">" + content().innerHTML + "</div>";
    document.body.append(f);
    await new Promise(r => f.onload = r);
    try {
      const d = f.contentDocument;
      eq(getComputedStyle(d.querySelector(".helptoc")).display, "none", "the contents wait behind the button");
      ok(getComputedStyle(d.querySelector(".helpcontents")).display !== "none", "the Contents button shows");
      ok(d.documentElement.scrollWidth <= 390, "nothing is wider than the phone");
    } finally { f.remove(); }
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
