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
  test("timeline: Dated only keeps the projects with a SCHEDULED day or a deadline", async () => {
    const loose = scratchProject("Loose plan", [["TODO", "Sketch the stand"]]);
    const dated = scratchProject("Dated plan", [["TODO", "Print the banner"]]);
    setBlockProp(getPage(dated).blocks[0], "DEADLINE", whenValue(shiftISO(todayISO(), 5)));
    clearMemo();
    const rows = () => [...content().querySelectorAll(".gantt")].map(g => g.textContent).join(" ");
    try {
      go("projects", {sub: "timeline", ganttSpan: "3", ganttDated: false});
      await settle();
      has(rows(), "Loose plan");
      has(rows(), "Dated plan");
      [...content().querySelectorAll(".gshowbox")].find(b => b.textContent.includes("Dated only")).querySelector("input").click();
      await settle();
      eq(state.ganttDated, true);
      ok(!rows().includes("Loose plan"), "an undated project is still drawn");
      has(rows(), "Dated plan");
    } finally { go("projects", {sub: "list", ganttDated: false}); await settle(); }
  });
  test("#197 timeline: zoom is one radio group, toggles are checkboxes, today is labelled, names are not cut", async () => {
    const name = "NATURSKADERAPPORT Nordland 2026";
    const path = scratchProject(name, [["TODO", "Draft the report"]]);
    setBlockProp(getPage(path).blocks[0], "DEADLINE", whenValue(shiftISO(todayISO(), 5)));
    clearMemo();
    try {
      go("projects", {sub: "timeline", ganttSpan: "3", ganttDated: false});
      await settle();
      const zoom = content().querySelector(".gzoomseg[role=radiogroup]");
      ok(zoom, "the zoom is not a radio group");
      eq([...zoom.querySelectorAll("[aria-checked=true]")].map(b => b.textContent).join(), "3 months");
      eq(content().querySelectorAll(".gshow input[type=checkbox]").length, 2);
      ok(!content().querySelector(".gzoomseg input, .gshow .chip"), "zoom and toggles still look alike");
      has(content().querySelector(".gantt .ghead .gtoday").textContent, "Today");
      ok(content().querySelector(".gantt .gfoot .glg"), "the colour key is outside the chart");
      ok(content().querySelector(".gfoot .helpdot"), "the footer has no ? help");
      ok(!/Drag a bar to move it/.test(content().textContent), "the long instruction line is back");
      const row = content().querySelector('.grow.group[data-row="' + CSS.escape(path) + '"]');
      const nm = row.querySelector(".gname .nm");
      ok(nm.scrollWidth <= nm.clientWidth + 1 && nm.scrollHeight <= nm.clientHeight + 1, "the name is cut off");
      ok(row.querySelector(".gname .n"), "the count is not under the name");
      eq(getComputedStyle(nm).textTransform, "none");
      eq(getComputedStyle(row).marginTop, "0px");
      ok(row.querySelector(".gbar .ghandle") === null, "a project bar has end grips");
      go("projects", {sub: "timeline", ganttOpen: path});
      await settle();
      const task = [...content().querySelectorAll(".grow.task .gbar.movable")];
      ok(task.length && getComputedStyle(task[0].querySelector(".ghandle")).opacity > 0, "a task bar's grips are hidden");
    } finally { go("projects", {sub: "list", ganttOpen: null}); await settle(); }
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

  /* A folder handle in memory: a tree of names, a string for a file. A file in
     `gate` waits for the promise before it opens. */
  const fakeDir = (name, tree, writes, gate = {}) => ({
    kind: "directory", name,
    async *entries() {
      for (const [k, v] of Object.entries(tree))
        yield [k, typeof v === "string" ? fakeFile(k, tree, writes, gate) : fakeDir(k, v, writes, gate)];
    },
    async getDirectoryHandle(k, {create} = {}) {
      if (!tree[k]) { if (!create) throw new DOMException("no", "NotFoundError"); tree[k] = {}; }
      return fakeDir(k, tree[k], writes, gate);
    },
    async getFileHandle(k, {create} = {}) {
      if (tree[k] == null) { if (!create) throw new DOMException("no", "NotFoundError"); tree[k] = ""; }
      return fakeFile(k, tree, writes, gate);
    },
    async removeEntry(k) { writes.push("rm " + k); delete tree[k]; },
  });
  const fakeFile = (k, tree, writes, gate) => ({
    kind: "file", name: k,
    async getFile() { if (gate[k]) await gate[k]; const t = tree[k]; return {text: async () => t}; },
    async createWritable() {
      return {write: async t => { writes.push(k); tree[k] = t; }, close: async () => {}};
    },
  });

  test("#181 a big folder shows today first, and a stand-in never overwrites its file", async () => {
    const old = shiftISO(T(), -10);
    let release;
    const held = new Promise(r => { release = r; });
    const gate = {[old + ".md"]: held, "Boat.md": held};
    const tree = {
      journals: {tester: {[T() + ".md"]: "- TODO today's line\n", [old + ".md"]: "- old line\n"}},
      pages: {"GTD.md": "title:: GTD\n", "1": {"Boat.md": "title:: Boat\noutcome:: afloat\n\n- TODO Sand the hull\n"}},
    };
    const writes = [];
    const rec = newRecord("Stage181", Backends.fs(fakeDir("Stage181", tree, writes, gate)));
    let rested = false;
    await readInto(rec, {stage: true, onRest: () => { rested = true; }});
    const boat = join(DIRS.active, "Boat.md");
    has(serializePage(rec.pages.get(join(JOURNALS, "tester", T() + ".md"))), "today's line", "today read first");
    ok(!rec.pages.has(join(JOURNALS, "tester", old + ".md")), "an old day waits");
    ok(rec.pages.has(boat) && !rec.pages.get(boat).blocks.length, "project there by name only");
    ok(rec.pages.has(SETTINGS_PATH), "settings read first");
    // Something marks the stand-in dirty: saving must leave the file alone.
    rec.dirty.add(boat);
    LOADED.set(rec.name, rec);
    try { await doFlush(); } finally { LOADED.delete(rec.name); }
    ok(!writes.includes("Boat.md"), "the stand-in was written over its file");
    has(tree.pages["1"]["Boat.md"], "Sand the hull", "file intact");
    release();
    await filesLoaded();
    ok(rested, "onRest ran");
    ok(!rec.stubs, "no stand-ins left");
    has(serializePage(rec.pages.get(boat)), "Sand the hull", "project read in full");
    ok(rec.pages.has(join(JOURNALS, "tester", old + ".md")), "old day read");
    ok(!rec.dirty.has(boat), "nothing left to send for the stand-in");
  });

  test("#181 the week, projects, people, contexts and orgs come in before the rest", async () => {
    const old = shiftISO(T(), -10), five = shiftISO(T(), -5);
    let release;
    const held = new Promise(r => { release = r; });
    const order = [];
    const tree = {
      journals: {[T() + ".md"]: "- today\n", [five + ".md"]: "- five days ago\n", [old + ".md"]: "- old\n"},
      pages: {"GTD.md": "title:: GTD\n",
        "0": {"Done.md": "title:: Done\n"}, "2": {"Later.md": "title:: Later\n"},
        "1": {"Boat.md": "title:: Boat\n\n- TODO Sand the hull\n"},
        p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\n\n- met at the fair\n"},
        c: {"phone.md": "title:: phone\n"}, o: {"CAB.md": "title:: CAB\n"}},
    };
    const b = Backends.fs(fakeDir("Soon181", tree, [], {[old + ".md"]: held, "Done.md": held, "Later.md": held}));
    const read = b.readMany.bind(b);
    b.readMany = (paths, onEach) => read(paths, p => { order.push(p); if (onEach) onEach(p); });
    const rec = newRecord("Soon181", b);
    let soon = false;
    try {
      await readInto(rec, {stage: true, onSoon: () => { soon = true; }});
      for (let i = 0; i < 40 && !soon; i++) await settle();
      ok(soon, "the first of the rest was not shown before the rest");
      has(serializePage(rec.pages.get(personPath("Odd Kittelsen"))), "met at the fair", "the person, before the rest");
      has(serializePage(rec.pages.get(join(DIRS.active, "Boat.md"))), "Sand the hull", "the project, before the rest");
      ok(rec.pages.has(join(JOURNALS, five + ".md")), "a day this week, before the rest");
      ok(!rec.stubs.has(join(DIRS.contexts, "phone.md")) && !rec.stubs.has(join(DIRS.orgs, "CAB.md")), "contexts and orgs still stand-ins");
      ok(rec.stubs.has(join(DIRS.completed, "Done.md")), "a done project came in early");
      ok(!rec.pages.has(join(JOURNALS, old + ".md")), "an old day came in early");
      ok(navLoading(), "no bar while the rest is read");
    } finally { release(); }
    await filesLoaded();
    ok(!rec.stubs, "no stand-ins left");
    ok(!LOADING.has(rec.name), "the bar stays once all is in");
    const at = p => order.indexOf(p);
    ok(at(join(DIRS.someday, "Later.md")) < at(join(DIRS.completed, "Done.md")), "someday before done");
    ok(at(join(DIRS.completed, "Done.md")) < at(join(JOURNALS, old + ".md")), "done before an old day");
  });
  test("#181 a stand-in edited while it loads gives way to its file when the first of the rest is in", () => {
    const rec = newRecord("Lay181", null);
    const path = personPath("Odd Kittelsen");
    rec.stubs = new Set([path]);
    rec.pages.set(path, parsePage(""));
    rec.dirty.add(path);
    const mine = join(JOURNALS, shiftISO(T(), -5) + ".md");
    rec.pages.set(mine, parsePage("- typed here meanwhile\n"));
    rec.dirty.add(mine);
    layInSoon(rec, new Map([[path, "title:: Odd Kittelsen\n\n- met at the fair\n"], [mine, "- the file\n"]]), new Set());
    has(serializePage(rec.pages.get(path)), "met at the fair", "the file");
    ok(!rec.stubs.has(path) && !rec.dirty.has(path), "still a stand-in, or still to be sent");
    has(serializePage(rec.pages.get(mine)), "typed here meanwhile", "a page made meanwhile");
  });
  test("#181 the bar under Pages shows how far, and a click lists each file", async () => {
    const rec = {name: "Bar181"};
    const tick = loadingTicker(rec, 4);
    try {
      tick("pages/p/Odd Kittelsen.md");
      renderNav();
      const bar = document.querySelector("#navLoad");
      ok(bar, "no bar in the sidebar");
      const pagesBtn = [...document.querySelectorAll("#nav .nav-item")].find(b => b.textContent.includes("Pages"));
      eq(pagesBtn.nextElementSibling, bar, "the bar is not under Pages");
      has(bar.textContent, "25%", "how far");
      ok(!bar.querySelector(".nav-load-list"), "the files show before a click");
      bar.querySelector("button").click();
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
      const list = document.querySelector("#navLoad .nav-load-list");
      ok(list, "a click does not list the files");
      has(list.textContent, "1 of 4", "files read");
      has(list.textContent, "p/Odd Kittelsen", "the file read");
    } finally {
      LOADING_OPEN = false;
      loadingDone(rec);
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    }
    ok(!document.querySelector("#navLoad"), "the bar stays once all is in");
  });

  test("#188 one file that will not open is skipped, not the whole read", async () => {
    // Bad.md fails when opened, the way a file the phone will not hand over does.
    const refused = Promise.reject(new DOMException("no", "NotReadableError"));
    refused.catch(() => {});
    const tree = {pages: {p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\n", "Bad.md": "x"}}};
    const b = Backends.fs(fakeDir("R188", tree, [], {"Bad.md": refused}));
    const files = await b.readMany(await b.names());
    ok(files.has("pages/p/Odd Kittelsen.md"), "the good file was lost with the bad one");
    ok(b.unread.has("pages/p/Bad.md"), "the file that would not open is not noted");
  });
  test("#188 a folder is listed one folder at a time, so a phone does not leave any out", async () => {
    // A phone's folder gives nothing to a listing started while another is open.
    let open = 0;
    const shy = (name, tree) => ({
      kind: "directory", name,
      async *entries() {
        if (open) return;
        open++;
        try {
          for (const [k, v] of Object.entries(tree))
            yield [k, typeof v === "string" ? {kind: "file", name: k, getFile: async () => ({text: async () => v})} : shy(k, v)];
        } finally { open--; }
      },
    });
    const tree = {journals: {[T() + ".md"]: "- today\n"},
      pages: {"GTD.md": "title:: GTD\n", p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\n"}, o: {"CAB MEPS.md": "title:: CAB MEPS\n"}}};
    const names = await Backends.fs(shy("Shy188", tree)).names();
    eq(names.slice().sort(), ["journals/" + T() + ".md", "pages/GTD.md", "pages/o/CAB MEPS.md", "pages/p/Odd Kittelsen.md"]);
  });
  test("#188 a file that fails while sixteen are read together gets one more try", async () => {
    let tries = 0;
    const flaky = Promise.reject(new DOMException("busy", "NotReadableError"));
    flaky.catch(() => {});
    const tree = {pages: {p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\n"}}};
    const gate = {get "Odd Kittelsen.md"() { return tries++ ? undefined : flaky; }};
    const b = Backends.fs(fakeDir("Retry188", tree, [], gate));
    const files = await b.readMany(await b.names());
    ok(files.has("pages/p/Odd Kittelsen.md"), "not read on the second try");
    ok(!b.unread.size, "still noted as would not open");
  });
  test("#188 a second listing does not lose files from a read under way", async () => {
    // More files than readers, so some are still to be opened when the folder is listed again.
    let release;
    const hold = new Promise(r => { release = r; });
    const people = {}, gate = {};
    for (let i = 0; i < 40; i++) { people["P" + i + ".md"] = "title:: P" + i + "\n"; if (i < 16) gate["P" + i + ".md"] = hold; }
    const b = Backends.fs(fakeDir("R188b", {pages: {p: people}}, [], gate));
    const names = await b.names();
    const reading = b.readMany(names);
    const again = b.names();          // somebody looks at the folder while it is read
    release();
    await again;
    const files = await reading;
    eq(files.size, names.length, "files read");
  });
  test("#188 a link to a page in the folder that was not read in opens the file, not a blank page", async () => {
    const tree = {pages: {p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\nphone:: 12345678\n\n- met at the fair\n"}}};
    const writes = [];
    const rec = newRecord("Link188", Backends.fs(fakeDir("Link188", tree, writes)));
    LOADED.set(rec.name, rec);
    try {
      inSpace(rec.name, () => openLinkTarget("p/Odd Kittelsen"));
      for (let i = 0; i < 20 && !rec.pages.has(personPath("Odd Kittelsen")); i++) await settle();
      const page = rec.pages.get(personPath("Odd Kittelsen"));
      ok(page, "the page was not opened");
      has(serializePage(page), "met at the fair", "the file's own lines");
      ok(!rec.dirty.has(personPath("Odd Kittelsen")), "the page read is queued to be written back");
      has(tree.pages.p["Odd Kittelsen.md"], "12345678", "the file was written over");
    } finally { LOADED.delete(rec.name); }
  });
  test("#188 Check the folder names a linked page the folder has but did not list", async () => {
    const tree = {pages: {"GTD.md": "title:: GTD\n", p: {}}, journals: {[T() + ".md"]: "- TODO call [[p/Odd Kittelsen]]\n"}};
    const rec = newRecord("Check188", Backends.fs(fakeDir("Check188", tree, [])));
    await readInto(rec);
    // In the folder by name, but the listing leaves it out.
    tree.pages.p["Odd Kittelsen.md"] = "title:: Odd Kittelsen\n";
    const hide = rec.backend.names.bind(rec.backend);
    rec.backend.names = async () => (await hide()).filter(n => !n.includes("Odd"));
    LOADED.set(rec.name, rec);
    try {
      const r = await folderCheckReport(rec.name);
      eq(r.unlisted, [personPath("Odd Kittelsen")], "linked and in the folder, not listed");
      eq(r.notIn, [], "listed but not in the app");
    } finally { LOADED.delete(rec.name); }
  });

  test("#188 the template pass leaves a page still being read alone", async () => {
    let release;
    const old = shiftISO(T(), -10);
    const tree = {journals: {[T() + ".md"]: "- today\n", [old + ".md"]: "- old\n"},
      pages: {"GTD.md": "title:: GTD\n", "8": {"p.md": "title:: %title%\ntype:: person\nphone:: \n"},
        p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\nupdated:: 2026-01-01T00:00:00Z\n\n- met at the fair\n"}}};
    const held = new Promise(r => { release = r; });
    const rec = newRecord("Tpl188", Backends.fs(fakeDir("Tpl188", tree, [], {[old + ".md"]: held, "Odd Kittelsen.md": held})));
    await readInto(rec, {stage: true});
    const path = personPath("Odd Kittelsen");
    ok(rec.stubs && rec.stubs.has(path), "the person is not a stand-in yet");
    LOADED.set(rec.name, rec);
    try {
      inSpace(rec.name, () => backfillUpdatedTemplates(rec.pages));
      ok(!rec.dirty.has(path), "the stand-in was filled in from its template");
      eq(serializePage(rec.pages.get(path)), serializePage(parsePage("")), "the stand-in");
      release();
      await filesLoaded();
      has(serializePage(rec.pages.get(path)), "met at the fair", "the file, once read");
    } finally { release(); LOADED.delete(rec.name); }
  });
  test("#188 a file that would not open is never written over", async () => {
    const refused = Promise.reject(new DOMException("no", "NotReadableError"));
    refused.catch(() => {});
    const tree = {pages: {"GTD.md": "title:: GTD\n", p: {"Odd Kittelsen.md": "title:: Odd Kittelsen\n\n- met at the fair\n"}}};
    const writes = [];
    const rec = newRecord("Unread188", Backends.fs(fakeDir("Unread188", tree, writes, {"Odd Kittelsen.md": refused})));
    await readInto(rec);
    const path = personPath("Odd Kittelsen");
    ok(rec.backend.unread.has(path), "not noted as would not open");
    rec.pages.set(path, pageTemplateFor("p", "Odd Kittelsen"));
    rec.dirty.add(path);
    LOADED.set(rec.name, rec);
    try { await doFlush(); } finally { LOADED.delete(rec.name); }
    ok(!writes.includes("Odd Kittelsen.md"), "a blank page went over the file");
    has(tree.pages.p["Odd Kittelsen.md"], "met at the fair", "the file");
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
    eq(readClock("8"), "08:00", "#50 just the hour");
    eq(readClock("12"), "12:00", "#50 just the hour");
    eq(readClock("25"), null);
  });
  test("#50 a visit after the fact starts with no clock, and a day takes two", async () => {
    const day = shiftISO(todayISO(), -3);
    const form = () => document.querySelector("#modalRoot .modal");
    const fill = (who, a, z) => {
      const ins = form().querySelectorAll("input");
      const set = (i, v) => { i.value = v; i.dispatchEvent(new Event("input")); i.dispatchEvent(new Event("change")); };
      set(ins[0], who);
      set(form().querySelector("input[type=date]"), day);
      const clk = form().querySelectorAll("input.clk");
      eq(clk[0].value, "", "no guessed clock on an earlier day");
      set(clk[0], a); set(clk[1], z);
      [...form().querySelectorAll(".foot button")].find(b => b.textContent === "Check in").click();
    };
    openTimeForm(null, null);
    await settle();
    ok(form().querySelector("input.clk").value, "today starts at now");
    fill("Ola Battery", "8", "12");
    await settle();
    const mine = () => timeLogEntries().filter(e => e.who === "Ola Battery" && e.date === day);
    eq(mine().map(e => blockProp(e.block, "in") + "-" + blockProp(e.block, "out")), ["08:00-12:00"]);
    openTimeForm(mine()[0].path, mine()[0].block);
    await settle();
    [...form().querySelectorAll(".foot button")].find(b => b.textContent === "+ Another time").click();
    await settle();
    fill("Ola Battery", "13", "1600");
    await settle();
    eq(mine().map(e => blockProp(e.block, "in") + "-" + blockProp(e.block, "out")), ["08:00-12:00", "13:00-16:00"]);
    eq(mine().reduce((s, e) => s + timeLogMin(e), 0), 420);
    for (const e of mine()) { removeBlockFrom(getPage(e.path), e.block); touch(e.path); }
  });
  test("#50 a project's time on site leads with the total, and the bars name their weeks", async () => {
    const p = projectsIn("1")[0];
    const made = [];
    const add = (days, a, z, who) => {
      const d = shiftISO(todayISO(), -days), t = ensureJournal(d), b = newBlock({}, false);
      b.title = "#timelog [[p/" + who + "]] [[" + pageRef(p) + "]]";
      setOrDropProp(b, "in", a); setOrDropProp(b, "out", z);
      getPage(t).blocks.push(b); touch(t); made.push([t, b]);
    };
    add(0, "08:00", "12:00", "Kari Battery");
    add(14, "13:00", "14:30", "Per Battery");
    try {
      const s = projectTimeSection(p);
      const card = s.querySelector(".sitetime");
      eq(s.querySelector("h3 .n"), null, "no total badge beside the heading");
      has(card.querySelector(".st-total").textContent, "5 h 30 m");
      has(card.querySelector(".st-who").textContent, "2 visits");
      has(card.querySelector(".st-who").textContent, "Kari Battery 4 h");
      ok(!/this week/i.test(card.textContent), "the bars say what the week text said");
      const bars = [...card.querySelectorAll(".hbar")];
      eq(bars.length, 8);
      eq(bars[7].querySelector(".w").textContent, "W" + isoWeek(todayISO())[0] + " (now)");
      eq(bars[7].querySelector(".v").textContent, "4 h");
      eq(bars[5].querySelector(".v").textContent, "1 h 30 m", "every week with time is labelled");
      eq(bars[6].querySelector(".v").textContent, "", "an empty week says nothing");
    } finally {
      for (const [t, b] of made) { removeBlockFrom(getPage(t), b); touch(t); }
    }
  });
  test("#50 Hours by project: the project's name opens the project", async () => {
    const p = projectsIn("1")[0];
    const t = ensureJournal(todayISO()), b = newBlock({}, false);
    b.title = "#timelog [[p/Kari Battery]] [[" + pageRef(p) + "]]";
    setOrDropProp(b, "in", "08:00"); setOrDropProp(b, "out", "09:00");
    getPage(t).blocks.push(b); touch(t);
    try {
      const items = timeLogEntries().filter(e => e.block === b);
      const link = hoursTable(weekStartISO(todayISO()), items, "project").querySelector("tbody .hlink");
      ok(link, "the name is a link");
      link.click();
      await settle();
      eq(state.view, "page");
      eq(state.pagePath, p);
      eq(hoursTable(weekStartISO(todayISO()), items, "person").querySelector(".hlink"), null, "people stay plain");
    } finally {
      removeBlockFrom(getPage(t), b); touch(t);
    }
  });
  test("#50 hours typed after a start on the clock are the hours", async () => {
    const form = () => document.querySelector("#modalRoot .modal");
    const set = (i, v) => { i.value = v; i.dispatchEvent(new Event("input")); i.dispatchEvent(new Event("change")); };
    openTimeForm(null, null);
    await settle();
    const ins = form().querySelectorAll("input");
    set(ins[0], "Kari Battery");
    const [tin, tout] = form().querySelectorAll("input.clk");
    set(tin, "08");
    const hrs = form().querySelector("input[inputmode=decimal]");
    set(hrs, "3.5");
    eq([tin.value, tout.value], ["", ""], "the clock gives way");
    ok(!tin.classList.contains("bad"), "and is not marked wrong");
    [...form().querySelectorAll(".foot button")].find(b => b.textContent === "Check in").click();
    await settle();
    const mine = timeLogEntries().filter(e => e.who === "Kari Battery");
    eq(mine.map(e => [blockProp(e.block, "in") || "", blockProp(e.block, "hours")]), [["", "3.5"]]);
    eq(timeLogMin(mine[0]), 210);
    for (const e of mine) { removeBlockFrom(getPage(e.path), e.block); touch(e.path); }
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
  test("#202 weekly, daily, monthly at the end of a line make it a repeat", () => {
    const w = parseWhen("Vacuum the stairs weekly");
    eq([w.title, w.repeat], ["Vacuum the stairs", "weekly"]);
    eq(parseWhen("Pay the rent monthly").repeat, "monthly");
    eq(parseWhen("Water the plants weekly on mon, thu").repeat, "weekly on mon, thu");
    eq(parseWhen("Weekly"), null, "a task called Weekly stays one");
    eq(parseWhen("Plan the weekly meeting"), null, "only at the end");
    const c = captureLine("Vacuum @home weekly");
    eq([plainTitle(c.block.title), repeatOf(c.block)], ["Vacuum", "weekly"]);
    has(c.block.title, "[[c/Home]]", "the context is still on the line");
    const s = siblingsOf(getPage(c.path), c.block); s.splice(s.indexOf(c.block), 1); touch(c.path);
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

  /* ---------- Chores (#201) ---------- */
  const chore = (t, repeat, n, props = {}) => stampAuthor(newBlock({state: "TODO", title: t,
    props: Object.assign({repeat, SCHEDULED: "[[" + shiftISO(T(), n) + "]]"}, props)}));
  const choreProject = (title, blocks) => {
    const path = scratchProject(title);
    getPage(path).blocks = blocks;
    touch(path); clearMemo();
    return path;
  };
  const dropChores = path => { getPage(path).blocks = []; touch(path); clearMemo(); };
  test("#201 a chore is an open task with a repeat, grouped by how far it has come round", () => {
    const path = choreProject("chores group", [
      chore("Wipe the counters [[c/home/kitchen]]", "daily", -2), chore("Scrub the shower [[c/home/bathroom]]", "weekly", 3),
      chore("Clean the fridge [[c/home/kitchen]]", "monthly", 20), stampAuthor(newBlock({state: "TODO", title: "Not a chore"})),
      chore("Send the weekly report [[c/office]]", "weekly", -1)]);
    try {
      const mine = choreRows().filter(a => a.path === path);
      eq(mine.map(a => plainTitle(a.title)), ["Wipe the counters", "Scrub the shower", "Clean the fridge"]);
      eq(mine.map(choreGroup), ["due", "soon", "fresh"]);
      const kitchen = freshScore(mine.filter(a => a.context === "home/kitchen"));
      ok(kitchen > 0 && kitchen < 50, "kitchen is " + kitchen + "% fresh");
      ok(NAV_ITEMS.find(it => it && it.id === "chores").when(), "Chores is in the sidebar once a task repeats");
    } finally { dropChores(path); }
  });
  test("#201 ticked in Chores, the next one is put in at once for whose turn it is, and Undo takes both back", async () => {
    const path = choreProject("chores tick", [chore("Take out the bins [[c/home]]", "weekly", 0)]);
    try {
      const b = getPage(path).blocks[0], turn = whoseTurn(b);
      go("chores"); await settle();
      const row = content().querySelector(idSel(".task", b.id, ".tick"));
      ok(row, "the chore is under Due now");
      row.click(); await settle();
      ok(!document.querySelector(".scrim .modal"), "no Again? dialog");
      const blocks = getPage(path).blocks;
      eq(blocks.map(x => x.state), ["DONE", "TODO"]);
      eq(dueDate(blocks[1]), shiftISO(T(), 7), "next one a week on");
      if (turn) ok(samePerson(assigneeOf(blocks[1], getPage(path)) || whoAmI(), turn), "for " + turn);
      const undo = [...document.querySelectorAll("#toasts button")].find(n => n.textContent === "Undo");
      ok(undo, "the done toast has Undo");
      undo.click(); await settle();
      eq(getPage(path).blocks.map(x => x.state), ["TODO"]);
    } finally { closeDoneToast(); closeModal(); dropChores(path); }
  });
  test("#201 the Chores chip on Next hides and shows the chores", async () => {
    const path = choreProject("chores chip", [chore("Water the plants [[c/home]]", "weekly", 0)]);
    try {
      go("next", {sub: "list"}); await settle();
      const chip = () => [...content().querySelectorAll(".fbar .fchip")].find(n => n.firstChild.textContent === "Chores");
      ok(chip(), "Next has a Chores chip");
      ok(content().textContent.includes("Water the plants"), "shown by default");
      chip().click(); await settle();
      ok(!content().textContent.includes("Water the plants"), "hidden after the chip");
      chip().click(); await settle();
      ok(content().textContent.includes("Water the plants"), "back again");
    } finally { PREF.set("next.chores", ""); dropChores(path); }
  });
  test("#201 points: a point per 15 minutes, one for a chore with no size, this week only", () => {
    const done = (t, who, day) => stampAuthor(newBlock({state: "DONE", title: t, props: {repeat: "weekly", done_by: who + " " + day + "T12:00:00.000Z"}}));
    const path = choreProject("chores points", [done("Mop the floor #30m", "Test Pointsperson", T()),
      done("Take out the bins", "Test Pointsperson", T()), done("Clean the oven #60m", "Test Pointsperson", shiftISO(weekStartISO(T()), -1))]);
    try {
      const row = choreTally(weekStartISO(T()), T()).find(([n]) => n === "Test Pointsperson");
      eq(row && row[1], {pts: 3, n: 2});
      const last = choreTally(shiftISO(weekStartISO(T()), -7), shiftISO(weekStartISO(T()), -1)).find(([n]) => n === "Test Pointsperson");
      eq(last && last[1], {pts: 4, n: 1});
    } finally { dropChores(path); }
  });
  test("#201 Away holds every chore, and Back now counts them from today", () => {
    const path = choreProject("chores away", [chore("Vacuum the stairs [[c/home]]", "weekly", -3)]);
    try {
      holdChores(shiftISO(T(), 7));
      ok(!choreRows().some(a => a.path === path), "held while away");
      const held = allChores().filter(a => a.held && a.path === path);
      eq(held.length, 1);
      choresBack(held);
      clearMemo();
      const a = choreRows().find(a => a.path === path);
      ok(a, "back on the list");
      eq(freshnessOf(a).rounds, 0, "counts from today");
    } finally { dropChores(path); }
  });
  /* ---------- contexts in folders (#201) ---------- */
  test("#201 @home/kitchen typed in the capture box is one context, and @kitchen finds it", () => {
    makeContext("home/kitchen");
    const a = captureLine("Wipe the hob @home/kitchen");
    has(a.block.title, "[[c/Home/Kitchen]]");
    ok(!a.block.title.includes("]]/"), "not @home and the words /kitchen");
    const b = captureLine("Empty the bin @kitchen");
    has(b.block.title, "[[c/Home/Kitchen]]");
    for (const x of [a, b]) { const s = siblingsOf(getPage(x.path), x.block); s.splice(s.indexOf(x.block), 1); touch(x.path); }
  });
  test("#201 a new context keeps its folder, and its link names it", () => {
    eq(makeContext("home/bath room"), "Home/Bath room");
    ok(getPage(join(DIRS.contexts, "Home", "Bath room.md")), "the page is in the home folder");
    eq(pageRef(join(DIRS.contexts, "Home", "Bath room.md")), "c/Home/Bath room");
    eq(pageRef(join(DIRS.contexts, "phone.md")), "c/phone");
  });
  test("#201 a context's children are only contexts, and picking one moves it into the folder", () => {
    makeContext("Testhome"); makeContext("Testgarden");
    const path = choreProject("garden link", [stampAuthor(newBlock({state: "TODO", title: "Mow the lawn [[c/Testgarden]]"}))]);
    const home = {path: contextPath("Testhome"), space: V.space};
    const page = getPage(home.path);
    page.blocks = [stampAuthor(newBlock({state: "TODO", title: "A task written on the context page [[c/Testhome]]"}))];
    touch(home.path); clearMemo();
    try {
      eq(relChildren(home, relAll()).length, 0, "the task on the page is not a child");
      relChildPicker(home);
      const items = [...document.querySelectorAll(".scrim .modal")].pop().textContent;
      has(items, "@Testgarden");
      ok(!items.includes("Mow the lawn") && !items.includes("Nordvik"), "only contexts are offered");
      closeModal();
      relAddParent(home, {path: contextPath("Testgarden"), space: V.space});
      ok(getPage(contextPath("Testhome/Testgarden")), "moved into the folder");
      ok(!getPage(contextPath("Testgarden")), "and gone from where it was");
      has(getPage(path).blocks[0].title, "[[c/Testhome/Testgarden]]");
      eq(relChildren(home, relAll()).map(r => r.path), [contextPath("Testhome/Testgarden")]);
    } finally { closeModal(); dropChores(path); }
  });
  test("#201 + Put a context inside offers a context that is only named on tasks, and nests it", () => {
    makeContext("Testflat");
    const path = choreProject("loose ctx", [stampAuthor(newBlock({state: "TODO", title: "Fix the shelf [[c/testshed]]"}))]);
    const flat = {path: contextPath("Testflat"), space: V.space};
    try {
      ok(!getPage(contextPath("testshed")), "testshed has no page of its own");
      go("page", {pagePath: flat.path}); render();
      const btn = [...content().querySelectorAll(".ctxnest")][0];
      ok(btn, "the context page has + Put a context inside");
      btn.click();
      const modal = [...document.querySelectorAll(".scrim .modal")].pop();
      has(modal.textContent, "@testshed");
      const pick = [...modal.querySelectorAll("button, [role=option], li, .row")].find(n => n.textContent.trim() === "@testshed");
      ok(pick, "testshed can be picked");
      pick.click();
      ok(getPage(contextPath("Testflat/testshed")), "it is inside Testflat now");
      has(getPage(path).blocks[0].title, "[[c/Testflat/testshed]]");
      eq(pageTitle(contextPath("Testflat/testshed")), "Testflat/testshed", "titled with its full name");
    } finally { closeModal(); dropChores(path); }
  });
  test("#201 renaming a context home/room moves it into the folder, and back out again, as Logseq does", () => {
    makeContext("Testroom"); makeContext("Testhouse");
    const path = choreProject("rename ns", [stampAuthor(newBlock({state: "TODO", title: "Dust [[c/Testroom]]"}))]);
    try {
      const into = renamePage(contextPath("Testroom"), "Testhouse/Testroom");
      eq(into, contextPath("Testhouse/Testroom"));
      ok(!getPage(contextPath("Testroom")), "gone from where it was");
      has(getPage(path).blocks[0].title, "[[c/Testhouse/Testroom]]");
      const out = renamePage(into, "Testroom");
      eq(out, contextPath("Testroom"));
      has(getPage(path).blocks[0].title, "[[c/Testroom]]");
      eq(renamePage(contextPath("Testhouse"), "Testhouse/inner"), contextPath("Testhouse"), "a page cannot go inside itself");
    } finally { dropChores(path); }
  });
  test("#201 the folder's contexts are written on its page as children::, as they come and go", () => {
    makeContext("Testabode"); makeContext("Testden"); makeContext("Testloft");
    const abode = {path: contextPath("Testabode"), space: V.space};
    nestContext(abode, {path: contextPath("Testden"), space: V.space});
    nestContext(abode, {path: contextPath("Testloft"), space: V.space});
    eq(getPage(abode.path).props.children, "[[c/Testabode/Testden]], [[c/Testabode/Testloft]]");
    renamePage(contextPath("Testabode/Testden"), "Testden");
    eq(getPage(abode.path).props.children, "[[c/Testabode/Testloft]]", "moved out, gone from the list");
    makeContext("Testabode/Testattic");
    eq(getPage(abode.path).props.children, "[[c/Testabode/Testattic]], [[c/Testabode/Testloft]]", "a new one in the folder is listed");
    makeContext("Testshack");
    renamePage(contextPath("Testshack"), "Testhut/Testshack");
    ok(getPage(contextPath("Testhut")), "renamed into a folder with no page, the page is made");
    eq(getPage(contextPath("Testhut")).props.children, "[[c/Testhut/Testshack]]");
  });
  test("#201 + New context inside makes one in the folder, so a second room can be added", () => {
    makeContext("Testflat2");
    const flat = {path: contextPath("Testflat2"), space: V.space};
    for (const room of ["one", "two"]) {
      relChildPicker(flat);
      const m = [...document.querySelectorAll(".scrim .modal")].pop();
      const add = [...m.querySelectorAll("button")].find(n => n.textContent.startsWith("+ New context inside"));
      ok(add, "the picker has + New context inside");
      add.click();
      const box = [...document.querySelectorAll(".scrim .modal")].pop();
      box.querySelector("input").value = room;
      [...box.querySelectorAll("button")].find(n => n.textContent === "Create").click();
    }
    closeModal();
    eq(getPage(flat.path).props.children, "[[c/Testflat2/One]], [[c/Testflat2/Two]]");
  });
  test("#205 a parent context shows what is in the ones inside it, and Contexts inside takes them off", () => {
    makeContext("Testparent"); makeContext("Testparent/Testkid"); makeContext("Testlinked");
    const parent = getPage(contextPath("Testparent"));
    parent.props.children = [parent.props.children, "[[c/Testlinked]]"].filter(Boolean).join(", ");
    touch(contextPath("Testparent")); clearMemo();
    const path = choreProject("parent ctx", ["Own [[c/Testparent]]", "In the folder [[c/Testparent/Testkid]]", "Named [[c/Testlinked]]"]
      .map(t => stampAuthor(newBlock({state: "TODO", title: t}))));
    const titles = () => [...content().querySelectorAll(".section")].find(s => s.textContent.includes("Things you can do here")).textContent;
    try {
      PREF.set("ctx.kids", ""); clearMemo();
      go("page", {pagePath: contextPath("Testparent")}); render();
      for (const t of ["Own", "In the folder", "Named"]) has(titles(), t);
      const chip = [...content().querySelectorAll(".fchip")].find(b => b.textContent.startsWith("Contexts inside"));
      ok(chip, "the page has the Contexts inside chip");
      eq(chip.getAttribute("aria-pressed"), "true", "on by default");
      chip.click();
      ok(!titles().includes("In the folder") && !titles().includes("Named"), "taken off");
      has(titles(), "Own");
      go("next", {sub: "list", ctxFilter: "Testparent"}); render();
      ok(!content().textContent.includes("In the folder"), "Next follows the same choice");
      [...content().querySelectorAll(".fchip")].find(b => b.textContent.startsWith("Contexts inside")).click();
      has(content().textContent, "In the folder");
      has(content().textContent, "Named");
      eq(oldestTodosForContext("Testparent", 10).length, 3, "Where am I now? surfaces them too");
    } finally { PREF.set("ctx.kids", ""); go("next", {ctxFilter: null}); go("contexts"); dropChores(path); }
  });
  test("#206 Contexts puts a folder's contexts on its card, late in red, and no-context actions on top", () => {
    makeContext("Testnest"); makeContext("Testnest/Room"); makeContext("Testidle");
    const path = choreProject("nest ctx", [
      stampAuthor(newBlock({state: "TODO", title: "Paint the wall [[c/Testnest/Room]]", props: {DEADLINE: "[[" + shiftISO(T(), -2) + "]]"}})),
      stampAuthor(newBlock({state: "TODO", title: "Fold the clothes"}))]);
    const was = PREF.get("contexts.idle", "");
    try {
      PREF.set("ctx.kids", ""); PREF.set("contexts.idle", ""); clearMemo();
      go("contexts"); render();
      const cards = [...content().querySelectorAll(".ctxcard")];
      ok(!cards.some(c => c.querySelector("h4").textContent === "@Testnest/Room"), "Room is not a card of its own");
      const card = cards.find(c => c.querySelector("h4").textContent === "@Testnest");
      ok(card, "the folder's top has the card");
      const kid = card.querySelector(".ctxkid");
      ok(kid && kid.textContent.startsWith("/Room"), "Room is a row on it");
      has(kid.querySelector(".chip.late").textContent, "1 late");
      ok(!content().textContent.includes("Show in Next") && !content().textContent.includes("things you can do here"), "no repeated words");
      ok(!content().querySelector(".ctxcard .big"), "no @ placeholder");
      ok(!content().querySelector(".vhead-r .textbtn:not(.newbtn)"), "one Sense button, not two links");
      has(content().querySelector(".ctxleak").textContent, "no context yet");
      ok(content().querySelector(".ctxleak").compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING, "the leak is above the cards");
      const fold = content().querySelector(".ctxfold");
      eq(fold.getAttribute("aria-expanded"), "false", "nothing to do is folded");
      ok(!content().textContent.includes("@Testidle"), "and its pills are hidden");
      fold.click();
      has(content().querySelector(".ctxpills").textContent, "@Testidle");
      content().querySelector(".ctxleak .textbtn").click();
      eq(state.view, "next"); eq(subNow(), "board");
    } finally { PREF.set("contexts.idle", was); go("contexts"); dropChores(path); }
  });
  /* ---------- context names and look-alikes (#203) ---------- */
  test("#203 a new context starts with a capital, and one already there keeps its spelling", () => {
    eq(makeContext("testcap"), "Testcap");
    eq(makeContext("testcap/inner"), "Testcap/Inner", "each part of the folder too");
    eq(makeContext("TESTCAP"), "Testcap", "typed in another case, it is the one you have");
    const a = captureLine("Ring the vet @@testcap");
    has(a.block.title, "[[c/Testcap]]");
    const s = siblingsOf(getPage(a.path), a.block); s.splice(s.indexOf(a.block), 1); touch(a.path);
  });
  test("#203 a context that looks like another is spotted, but not its own folder", () => {
    eq(ctxLikeness("Phones", "phone"), 1);
    eq(ctxLikeness("Errnd", "errand"), 1);
    eq(ctxLikeness("Kitchen", "home/kitchen"), 3);
    eq(ctxLikeness("Car", "Bar"), 0, "short names need more than one letter alike");
    eq(ctxLikeness("Garden", "Office"), 0);
    makeContext("testlook/testlookroom");
    eq(contextLookalike("testlook/testlookroom"), null, "its folder is not a look-alike");
  });
  test("#203 a new look-alike context is merged into the old one, links and all, and Undo splits it out", async () => {
    makeContext("Testwarehouse");
    const path = choreProject("lookalike ctx", []);
    try {
      const made = makeContext("testwarehouses");
      eq(made, "Testwarehouses");
      const b = stampAuthor(newBlock({state: "TODO", title: "Count the boxes [[c/" + made + "]]"}));
      getPage(path).blocks.push(b); touch(path);
      await settle();
      ok(!getPage(contextPath("Testwarehouses")), "merged away");
      has(b.title, "[[c/Testwarehouse]]");
      const t = [...document.querySelectorAll("#toasts .toast")].pop();
      has(t.textContent, "@Testwarehouses looks like @Testwarehouse");
      [...t.querySelectorAll("button")].find(x => x.textContent === "Undo").click();
      ok(getPage(contextPath("Testwarehouses")), "Undo brings it back");
      has(getPage(path).blocks[0].title, "[[c/Testwarehouses]]", "and its link");
    } finally { dropChores(path); document.querySelectorAll("#toasts .toast").forEach(x => x.remove()); }
  });
  test("#203 renaming a context onto one that is there, in any case, merges into it, and Undo splits it out", () => {
    makeContext("Testconsume/Testread"); makeContext("Testcrjad");
    const path = choreProject("rename merge ctx", [stampAuthor(newBlock({state: "TODO", title: "Read the paper [[c/Testcrjad]]"}))]);
    try {
      eq(renamePage(contextPath("Testcrjad"), "testconsume/testread"), contextPath("Testconsume/Testread"));
      ok(!getPage(contextPath("Testcrjad")), "merged away");
      has(getPage(path).blocks[0].title, "[[c/Testconsume/Testread]]");
      const t = [...document.querySelectorAll("#toasts .toast")].pop();
      [...t.querySelectorAll("button")].find(x => x.textContent === "Undo").click();
      ok(getPage(contextPath("Testcrjad")), "Undo brings it back");
      has(getPage(path).blocks[0].title, "[[c/Testcrjad]]", "and its link");
    } finally { dropChores(path); document.querySelectorAll("#toasts .toast").forEach(x => x.remove()); }
  });
  /* ---------- aliases on every page (#207) ---------- */
  test("#207 a context's alias is that context, typed, captured or picked", () => {
    makeContext("Testcomputer");
    const cp = contextPath("Testcomputer");
    getPage(cp).props.aliases = "tpc"; touch(cp); clearMemo();
    try {
      eq(contextByAlias("tpc"), "Testcomputer");
      eq(contextByAlias("@TPC"), "Testcomputer", "any case, with or without @");
      eq(ctxSlug("tpc"), "Testcomputer");
      eq(makeContext("tpc"), "Testcomputer", "no new context called Tpc");
      ok(!getPage(contextPath("Tpc")), "no page made for the alias");
      const a = captureLine("Back up the laptop @tpc");
      has(a.block.title, "[[c/Testcomputer]]");
      const s = siblingsOf(getPage(a.path), a.block); s.splice(s.indexOf(a.block), 1); touch(a.path);
      const rows = aliasRows(nameIndex().filter(n => n.kind === "context"), "tpc");
      eq(rows[0]?.ref, "c/Testcomputer");
      eq(rows[0]?.label, undefined, "a context link keeps its own name, so the line still knows it");
    } finally { delete getPage(cp).props.aliases; touch(cp); clearMemo(); }
  });
  test("#207 a project or a note is found by its alias, and the link reads the alias with the name on hover", () => {
    const path = scratchProject("alias project", [["TODO", "Something"]]);
    const note = join(DIRS.zettel, "Test alias note.md");
    putPage(note, {props: {title: "Test alias note", aliases: "tanote"}, blocks: []});
    getPage(path).props.aliases = "tproj"; touch(path); clearMemo();
    try {
      eq(nameByRef(pageRef(path))?.aliases, ["tproj"]);
      const hit = linkCandidates("tproj")[0];
      eq([hit?.path, hit?.label], [path, "tproj"]);
      ok(!linkCandidates("tproj").some(r => r.isNew), "no Make row for an alias");
      eq(linkCandidates("tanote")[0]?.path, note);
      const html = renderInline("[[" + pageRef(note) + "][tanote]]");
      has(html, 'title="Test alias note"');
    } finally { removePage(note); delete getPage(path).props.aliases; touch(path); clearMemo(); }
  });
  test("#207 a context's alias that names another context merges them, never with another kind of page", () => {
    makeContext("Testlaptop");
    const lp = contextPath("Testlaptop");
    const path = choreProject("alias merge ctx", [stampAuthor(newBlock({state: "TODO", title: "Charge it [[c/Testlt]]"}))]);
    putPage(join(DIRS.people, "Testlt.md"), {props: {title: "Testlt"}, blocks: []});
    clearMemo();
    try {
      const before = pageAliases(lp);
      getPage(lp).props.aliases = "Testlt"; touch(lp); clearMemo();
      const twins = aliasTwins(lp, before);
      eq(twins, [contextPath("Testlt")], "the context named on a task, not the person");
      mergeContextInto("Testlt", "Testlaptop");
      has(getPage(path).blocks[0].title, "[[c/Testlaptop]]");
    } finally {
      removePage(join(DIRS.people, "Testlt.md")); delete getPage(lp).props.aliases; touch(lp);
      dropChores(path); document.querySelectorAll("#toasts .toast").forEach(x => x.remove()); clearMemo();
    }
  });
  test("#201 + New chore writes the line on the room's page", async () => {
    go("chores"); await settle();
    openNewChore("");
    const m = document.querySelector(".scrim .modal");
    m.querySelector('input[aria-label="What"]').value = "Test descale the kettle";
    const sel = m.querySelectorAll("select");
    sel[0].value = "\u0002"; sel[0].dispatchEvent(new Event("change"));
    m.querySelector('input[aria-label="New room"]').value = "testkitchen";
    sel[1].value = "monthly"; sel[2].value = "1";
    [...m.querySelectorAll("button")].find(n => n.textContent === "Add chore").click();
    await settle();
    const page = getPage(contextPath("Home/Testkitchen"));
    try {
      ok(page, "the room's page was made");
      const b = page.blocks.find(x => x.title.includes("Test descale the kettle"));
      ok(b, "the chore is on it");
      eq([b.state, repeatOf(b), estTier(b.title), dueDate(b)], ["TODO", "monthly", 1, T()]);
      has(b.title, "[[c/Home/Testkitchen]]");
    } finally { if (page) { page.blocks = []; touch(contextPath("Home/Testkitchen")); clearMemo(); } }
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
  test("#198 a person on a line above counts for the tasks under it", () => {
    const day = journalPath("2003-03-03"), joe = personPath("Joe Newmann");
    putPage(joe, {props: {title: "Joe Newmann"}, blocks: []});
    putPage(day, parsePage([
      "- |[[1/Kitchen renovated]]",
      "  - [[p/Joe Newmann]]",
      "    - DONE bought 50 lm 3x5 lekter 50 EUR",
      "    - WAIT Will find paneling ties",
      "      added:: [[2026-10-30]]",
      "      by:: Kenneth Aar",
      "    - TODO Ask about the colour",
      "    - WAIT [[p/Lars Haugen]] sends the drawing",
      "- WAIT [[p/Joe Newmann]]  Will find paneling ties [[1/Kitchen renovated]]",
    ].join("\n")));
    clearMemo();
    try {
      const row = t => leafActions().find(a => a.path === day && a.block.title === t);
      const under = row("Will find paneling ties");
      const flat = row("[[p/Joe Newmann]]  Will find paneling ties [[1/Kitchen renovated]]");
      ok(under && flat, "both lines are actions");
      for (const k of ["project", "assignee", "group", "mine"]) eq(under[k], flat[k], k);
      eq(under.assignee, "Joe Newmann");
      eq(waitsOn(under), ["Joe Newmann"], "waits on");
      ok(waitingOnFrom("Joe Newmann").some(a => a.block === under.block), "in what Joe owes");
      ok(globalPeopleRows().find(r => r.name === "Joe Newmann").items.some(a => a.block === under.block), "on Joe's row");
      ok(askingAbout("Joe Newmann").some(a => a.block.title === "Ask about the colour"), "a TODO under Joe is to raise with him");
      eq(row("[[p/Lars Haugen]] sends the drawing").assignee, "Lars Haugen", "the line's own name wins");
    } finally { removePage(day); removePage(joe); clearMemo(); }
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

  test("#164 a folder area opened without its folder shows the reconnect panel, not browser storage", async () => {
    const view = state.view;
    PENDING_GRANT.set(V.space, {name: "Vault folder", kind: "directory"});
    try {
      go("today");
      await settle();
      const panel = content().querySelector(".folderaway");
      ok(panel, "no reconnect panel in place of the pages");
      has(panel.textContent, "Vault folder");
      const btns = [...panel.querySelectorAll("button")];
      ok(btns.some(b => b.textContent === "Allow access to Vault folder"), "no Allow access button");
      ok(!content().querySelector(".blk"), "browser storage's lines are shown under it");
      eq(requireTemplate("no such template 164"), null);
      ok(![...document.querySelectorAll(".toast, #toasts *")].some(t => t.textContent.includes("no such template 164")),
        "browser storage offers to make a template the folder has");
      btns.find(b => b.textContent.startsWith("Not now")).click();
      await settle();
      ok(!content().querySelector(".folderaway"), "Not now did not show the pages");
    } finally {
      PENDING_GRANT.delete(V.space);
      AWAY_OK.delete(V.space);
      go(view);
    }
  });

  /* ---------- the key that takes a suggestion (#190) ---------- */
  {
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    // Writes "Ring [[Lars Hau" on a fresh line, as if typed, so the list opens.
    const typeLink = async (title) => {
      const path = scratchProject(title, [["TODO", "x"]]);
      openPage(path);
      await settle();
      const b = getPage(path).blocks[0];
      focusBlock(b.id);
      await frame();
      const txt = document.querySelector('.blk[data-id="' + b.id + '"] .txt');
      txt.textContent = "Ring [[Lars Hau";
      const r = document.createRange(); r.selectNodeContents(txt); r.collapse(false);
      getSelection().removeAllRanges(); getSelection().addRange(r);
      txt.dispatchEvent(new Event("input", {bubbles: true}));
      await frame();
      ok(SUGGEST && SUGGEST.host === txt, "the [[ list did not open");
      return {path, txt};
    };
    const press = async (txt, key) => {
      txt.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true}));
      await frame(); await frame();
    };
    const withKeys = async (k, fn) => {
      PREF.set("suggest.accept", k);
      try { await fn(); } finally { PREF.set("suggest.accept", "enter"); suggestClose(); go("today"); }
    };
    test("#190 Enter takes a suggestion by default", async () => {
      eq(suggestKeys(), "enter", "the default");
      await withKeys("enter", async () => {
        const {path, txt} = await typeLink("enter takes");
        has(SUGGEST.box.textContent, "Enter takes it", "the hint");
        await press(txt, "Enter");
        has(txt.textContent, "[[p/Lars Haugen]]", "the link went in");
        eq(getPage(path).blocks.length, 1, "Enter also made a new line");
      });
    });
    test("#190 with Enter chosen, Tab closes the list and does not take the suggestion", async () => {
      await withKeys("enter", async () => {
        const {txt} = await typeLink("tab indents");
        await press(txt, "Tab");
        ok(!txt.textContent.includes("Lars Haugen]]"), "Tab took the suggestion");
        ok(!SUGGEST, "the list stayed open");
      });
    });
    test("#190 with Tab chosen, Enter ends the line and Tab takes it", async () => {
      await withKeys("tab", async () => {
        const {path, txt} = await typeLink("tab takes");
        has(SUGGEST.box.textContent, "Tab takes it", "the hint");
        await press(txt, "Enter");
        ok(!txt.textContent.includes("Lars Haugen]]"), "Enter took the suggestion");
        eq(getPage(path).blocks.length, 2, "Enter made no new line");
        const again = await typeLink("tab takes 2");
        await press(again.txt, "Tab");
        has(again.txt.textContent, "[[p/Lars Haugen]]", "Tab took nothing");
      });
    });
    test("#190 a word completion takes only Tab, whatever is chosen", () => {
      for (const k of ["enter", "tab", "both"]) {
        PREF.set("suggest.accept", k);
        eq(suggestTakes("Enter", "word"), false, k + ": Enter took a word");
        eq(suggestTakes("Tab", "word"), true, k + ": Tab did not take a word");
        eq(suggestTakes("Enter", "slash"), k !== "tab", k + ": Enter on a command");
        eq(suggestTakes("Tab", "link"), k !== "enter", k + ": Tab on a link");
      }
      PREF.set("suggest.accept", "enter");
    });
    test("#190 Settings has a Writing pick for the key", async () => {
      go("checklists");
      await settle();
      const seg = content().querySelector(".writeset .seg");
      ok(seg, "no Writing pick on Settings");
      eq([...seg.children].map(b => b.textContent), ["Enter", "Tab", "Tab or Enter"]);
      eq(seg.querySelector(".on").textContent, "Enter", "the default is picked");
      seg.children[1].click();
      eq(PREF.get("suggest.accept"), "tab", "picking Tab");
      seg.children[0].click();
      eq(PREF.get("suggest.accept"), "enter", "picking Enter");
    });
  }

  /* ---------- areas: one place, removing, onboarding (#193) ---------- */
  const closeModals = () => { for (let i = 0; i < 4 && $("#modalRoot").firstChild; i++) closeModal(); };
  test("#193 the welcome screen offers coming back with your folders", () => {
    try {
      openOnboarding();
      has(document.querySelector("#modalRoot .modal").textContent, "I have used GroupToDo before");
    } finally { closeModals(); }
  });
  test("#193 Your areas holds every area's colour, Remove, New area and Invite", () => {
    const n = "Test193 dialog";
    return (async () => {
      await createSpace(n, "local");
      try {
        openSpaceStorageSetup();
        const m = document.querySelector("#modalRoot .modal");
        has(m.textContent, "Your areas");
        const cards = [...m.querySelectorAll(".afcard")];
        eq(cards.length, Spaces.list.length, "one card per area");
        ok(cards.every(c => c.querySelector(".afdot")), "a card without its colour dot");
        ok(cards.every(c => [...c.querySelectorAll("button")].some(b => b.textContent === "Remove")), "a card without Remove");
        const foot = [...m.querySelectorAll("button")].map(b => b.textContent);
        ok(foot.includes("+ New area") && foot.includes("Invite somebody"), "no New area or Invite: " + foot);
        ok(!m.textContent.includes("null"), "a null written as text");
      } finally { closeModals(); await removeArea(n); }
    })();
  });
  test("#193 removing an area forgets it and its browser pages, and keeps the rest", async () => {
    const n = "Test193 gone", before = Spaces.list.length, active = Spaces.active;
    await createSpace(n, "local");
    LS.set(n + "|pages/x.md", "- TODO x");      // IndexedDB is not open in the test page
    ok(await removeArea(n), "removeArea said no");
    eq(Spaces.get(n), null, "still listed");
    eq(Spaces.list.length, before, "other areas lost or kept");
    eq(LS.all().has(n + "|pages/x.md"), false, "its browser pages are left behind");
    eq(Spaces.active, active, "the active area changed");
  });
  test("#193 Set up several areas adds to the area just set up, never a second one", async () => {
    const sp = Spaces.get(Spaces.active), named = sp.named;
    sp.placeholder = true;
    const before = Spaces.list.length;
    try {
      await finishSpaceSetup([sp.name, "Test193 extra"]);
      eq(Spaces.list.length, before + 1, "areas made");
      ok(Spaces.get(sp.name) && !sp.placeholder, "the area set up first was replaced");
      ok(Spaces.get("Test193 extra"), "the new area is missing");
    } finally {
      delete sp.placeholder; if (named) sp.named = named; else delete sp.named;
      closeModals(); await removeArea("Test193 extra");
    }
  });
  test("#193 setting up areas offers a folder or this browser, never a server", () => {
    const base = SERVER_BASE;
    SERVER_BASE = "http://127.0.0.1:8777";          // as if served by serve.py with a folder
    try {
      for (const open of [() => openSpaceStorageSetup(), () => openOnboardBack()]) {
        closeModals(); open();
        const text = document.querySelector("#modalRoot .modal").textContent;
        ok(!/server|serve\.py/i.test(text), "a server is offered: " + text.slice(0, 200));
      }
    } finally { SERVER_BASE = base; closeModals(); }
  });
  test("#193 serve.py's folder is offered only when serve.py was given one", async () => {
    const f = window.fetch, served = CAP.served, base = SERVER_BASE;
    const ping = j => { window.fetch = async () => ({ok: true, json: async () => j}); SERVER_BASE = null; };
    try {
      CAP.served = true;
      ping({ok: true, vault: "/x", vaultChosen: false});
      eq(await detectServer(), "", "a made-up default offered");
      ping({ok: true, calendarsOnly: true});
      eq(await detectServer(), "", "a calendars-only helper offered");
      ping({ok: true, vault: "/x", vaultChosen: true});
      ok(await detectServer(), "a chosen folder not offered");
    } finally { window.fetch = f; CAP.served = served; SERVER_BASE = base; }
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
  test("#158 a responsibility's values always offer + stakeholder, and show each one", () => {
    const {area} = scratchResp("");
    delete getPage(area).props.stakeholder;
    const empty = pageFacts(area).filter(f => f.key === "stakeholders");
    eq(empty.length, 1, "no stakeholders line on a responsibility without one");
    eq(empty[0].pills().map(p => p.textContent), ["+ stakeholder"]);
    getPage(area).props.stakeholder = "[[p/Lars Haugen]], [[o/Nordvik Shipping]]";
    const set = pageFacts(area).filter(f => /^stakeholders?$/.test(f.key));
    eq(set.length, 1, "stakeholder:: shown twice");
    eq(set[0].pills().map(p => p.textContent), ["Lars Haugen", "Nordvik Shipping", "+ stakeholder"]);
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
  test("#194 an empty email asks for one, and never offers another person's", async () => {
    const saved = [];
    const f = {key: "email", save: t => saved.push(t)};
    eq(blankFactPill(personPath("Lars Haugen"), f).textContent.trim(), "+ write email");
    try {
      blankFactPicker(personPath("Lars Haugen"), f);
      await settle();
      const m = document.querySelector("#modalRoot .modal");
      ok(m?.querySelector(".field input"), "no box to write the email in");
      ok(!m.querySelector(".filterbox"), "a list of emails already in the vault");
    } finally { closeModal(); }
    eq(blankFactPill(personPath("Lars Haugen"), {key: "role", save: () => {}}).textContent.trim(), "+ choose role",
      "a key whose values repeat still offers them");
  });
  test("#191 a waiting-for naming two people is on both their pages, and your tasks naming them are their agenda", async () => {
    const path = scratchProject("two waits", [["WAIT", "[[p/Lars Haugen]] og [[p/Emma Dahl]] skriver to artikler"],
      ["TODO", "Ask [[p/Lars Haugen]] about the depot"]]);
    const w = getPage(path).blocks[0];
    clearMemo();
    for (const name of ["Lars Haugen", "Emma Dahl"]) {
      ok(waitingOnFrom(name).some(a => a.block === w), "not waiting on " + name);
      ok(openActionsOf(name).some(a => a.block === w), "not on " + name + "'s list");
    }
    openPage(personPath("Lars Haugen"));
    await settle();
    const lists = Object.fromEntries([...content().querySelectorAll(".section>h3")]
      .map(h => [h.firstChild.textContent, h.parentNode.textContent]));
    const own = isMember("Lars Haugen") ? "Next actions" : "Waiting for";
    ok(!("Open" in lists), "still called Open");
    has(lists[own] || "", "skriver to artikler");
    has(lists.Agenda || "", "about the depot");
    ok(!(lists.Agenda || "").includes("skriver to artikler"), "the waiting-for is shown twice");
    go("today");
  });

  test("#187 a person's page picks the responsibilities they are a stakeholder in, and the responsibility says so", async () => {
    const who = "Test Stake Person " + Date.now();
    const {area} = scratchResp("");
    delete getPage(area).props.stakeholder;
    createLinkedPages("[[p/" + who + "]]");
    openPage(personPath(who));
    await settle();
    const row = () => content().querySelector(".stakein");
    ok(row(), "no Stakeholder in row on a person who is in nothing");
    const add = [...row().querySelectorAll("button")].find(b => b.textContent === "+ responsibility");
    ok(add, "no + responsibility");
    add.click();
    await settle();
    const item = [...document.querySelectorAll(".modal *")].find(x => x.children.length === 0 && x.textContent === pageTitle(area));
    ok(item, "the responsibility is not in the picker");
    item.click();
    await settle();
    eq(stakeholdersOfArea(area).map(s => s.name), [who], "not written on the responsibility");
    has(row().textContent, pageTitle(area));
    row().querySelector("button[aria-label^='No longer']").click();
    await settle();
    eq(stakeholdersOfArea(area), [], "× left them on the responsibility");
    undoLast();
    eq(stakeholdersOfArea(area).map(s => s.name), [who], "Ctrl-Z did not bring them back");
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
  test("#160 #209 a Journal row: the state, the context, the words, then the project", async () => {
    const {path, blocks, row} = await journalDue([["TODO", "Call Bob about the quote [[c/phone]]"]]);
    const r = row(blocks[0]);
    ok(r, "the row is under Due today & late");
    const kids = [...r.children].map(n => n.className.split(" ")[0]);
    eq(kids.slice(0, 4), ["t-chk", "chip", "t-title", "t-eyebrow"], "order");
    has(r.querySelector(".t-eyebrow").textContent, pageTitle(path));
    eq(r.querySelector(":scope > .chip.ctx").textContent, "@phone");
    ok(!r.querySelector(".t-title").textContent.includes("phone"), "the context is not said twice");
    eq(r.lastElementChild.classList.contains("t-menu"), true, "the row's ⋯ ends it");
    ok(!r.querySelector(".duepill"), "due today goes without saying under Due today");
  });
  test("#209 a Journal row is one line, its chips at the right edge before ⋯", async () => {
    const {blocks, row} = await journalDue([["TODO", "Write up the long and winding minutes of the meeting about the quarterly figures and what came of them [[c/pc]]"]],
      shiftISO(T(), -1));
    const r = row(blocks[0]);
    ok(r.offsetHeight <= 48, "one line, not " + r.offsetHeight + "px");
    const t = r.querySelector(".t-title");
    eq(getComputedStyle(t).whiteSpace, "nowrap", "long words end in …");
    eq(r.lastElementChild.previousElementSibling.className, "t-meta", "the chips just before ⋯");
    const meta = r.querySelector(".t-meta").getBoundingClientRect(), menu = r.querySelector(".t-menu").getBoundingClientRect();
    ok(menu.left - meta.right < 16, "the chips sit at the right edge");
  });
  test("#209 a chore on its room's own page says the room once under Due today", async () => {
    const path = contextPath("Testroom209");
    const b = stampAuthor(newBlock({state: "TODO", title: "Wipe the counters [[c/Testroom209]]"}));
    putPage(path, {props: {}, blocks: [b]});
    setDue(b, T()); touch(path); clearMemo();
    PREF.set("today.tab", "due");
    go("today");
    await settle();
    const r = content().querySelector('.task.jrow[data-id="' + b.id + '"]');
    ok(r, "the chore is under Due today");
    ok(!r.querySelector(".t-eyebrow"), "no project line naming the room again");
    eq(r.querySelector(":scope > .chip.ctx").textContent, "@Testroom209");
  });
  test("#209 on a phone, Due today is grouped by context, late first", async () => {
    const was = Object.getOwnPropertyDescriptor(PHONE, "matches");
    Object.defineProperty(PHONE, "matches", {value: true, configurable: true});
    try {
      const path = scratchProject("phone209", [["TODO", "Ring the plumber [[c/phone]]"], ["TODO", "Print the form [[c/office]]"],
        ["TODO", "Ring the bank [[c/phone]]"]]);
      const bs = getPage(path).blocks;
      setDue(bs[0], T()); setDue(bs[1], shiftISO(T(), -2)); setDue(bs[2], T());
      touch(path); clearMemo();
      PREF.set("today.tab", "due");
      go("today");
      await settle();
      const heads = [...content().querySelectorAll(".jgroup .chip.ctx")].map(h => h.textContent);
      ok(heads.includes("@office") && heads.indexOf("@office") < heads.indexOf("@phone"), "the late one's group first: " + heads);
      eq(heads.filter(h => h === "@phone").length, 1, "each context said once");
      const r = content().querySelector('.task.jrow[data-id="' + bs[0].id + '"]');
      ok(!r.querySelector(":scope > .chip.ctx"), "the row does not say the context again");
      eq(r.previousElementSibling.classList.contains("jgroup") || r.previousElementSibling.dataset.id === bs[2].id || r.nextElementSibling.dataset.id === bs[2].id, true, "both phone rows together");
    } finally {
      if (was) Object.defineProperty(PHONE, "matches", was); else delete PHONE.matches;
    }
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
  /* Trackers of the test's own on today and yesterday, and their pages, gone again after. */
  const withTrackers = async (lines, fn) => {
    const made = [], added = [], names = new Set();
    for (const [days, key, value] of lines) {
      const path = journalPath(shiftISO(T(), days));
      if (!V.pages.has(path)) { putPage(path, {props: {}, blocks: []}); made.push(path); }
      getPage(path).props[key] = value;
      added.push([path, key]);
      names.add(parseTracker(key + "::").name);
      touch(path);
    }
    try { clearMemo(); return await fn(); }
    finally {
      for (const [path, key] of added) if (getPage(path)) { delete getPage(path).props[key]; touch(path); }
      for (const p of made) removePage(p);
      for (const n of names) if (V.pages.has(trackerPagePath(n))) removePage(trackerPagePath(n));
      clearMemo();
    }
  };
  const drinks = [[0, "tracker-t195water_i", "💧💧💧💧"], [0, "tracker-t195coffee_i", "☕☕"],
    [-1, "tracker-t195water_i", "💧💧"], [-1, "tracker-t195coffee_i", "☕☕☕"]];
  test("#195 trackers of one kind that name the same chart share one card, with each value and the total", () =>
    withTrackers(drinks, () => {
      setTrackerChart("t195water", "Drinks");
      setTrackerChart("t195coffee", "drinks");
      eq(trackerProp("t195coffee", "chart"), "Drinks", "takes the chart's own spelling");
      const chart = trackerCharts(trackerList()).find(c => c.name === "Drinks");
      ok(chart, "one Drinks chart");
      eq(chart.groups.map(g => g.name), ["t195coffee", "t195water"]);
      const card = trackerChartCard(chart);
      has(card.textContent, "6 together today");
      has(card.textContent, "2 trackers");
      ok(!card.querySelector(".fbar"), "no style or stack buttons on the card");
      ok(card.querySelectorAll(".trkdays .br").length >= 4, "stacked bars by default");
      eq(card.querySelectorAll(".trkdays text.lbl").length, 2, "each named at its end");
      const tip = [...card.querySelectorAll(".trkdays .hit title")].pop().textContent;
      has(tip, "Together  6");
      has(tip, "💧 T195water  4");
    }));
  test("#195 a tracker of another kind never shares the chart", () =>
    withTrackers([...drinks, [0, "tracker-t195walk_m", "30"]], () => {
      setTrackerChart("t195water", "Drinks");
      setTrackerChart("t195coffee", "Drinks");
      ok(!trackerChartNames("t195walk").includes("Drinks"), "not offered");
      setTrackerChart("t195walk", "Drinks");
      const charts = trackerCharts(trackerList());
      eq(charts.find(c => c.name === "Drinks").groups.length, 2, "still the two drinks");
      ok(charts.some(c => !c.name && c.groups[0].name === "t195walk"), "walk on its own card");
    }));
  test("#195 the style set on one tracker of a shared chart is the whole chart's, and leaving drops stacked", () =>
    withTrackers(drinks, () => {
      setTrackerChart("t195water", "Drinks");
      setTrackerChart("t195coffee", "Drinks");
      eq(trackerChartStyle(["t195coffee", "t195water"], true), "stacked-bar", "stacked by default");
      setTrackerStyle("t195water", "line");
      eq(trackerProp("t195coffee", "style"), "line", "the other one too");
      setTrackerStyle("t195water", "stacked-bar");
      setTrackerChart("t195coffee", "");
      eq(trackerProp("t195coffee", "style"), "", "alone, stacked is gone");
      eq(trackerChartStyle(["t195coffee"], false), "line");
    }));
  test("#195 a tracker's page is made when first opened, is not a template, and its icon:: wins over Settings", () =>
    withTrackers(drinks, () => {
      const at = ensureTrackerPage("t195water");
      eq(at.path, DIRS.lists + "/Trackers/t195water.md");
      ok(!isTemplatePath(at.path), "not a template");
      ok(!checklistPages().includes(at.path), "not among the lists");
      setTrackerProp("t195water", "icon", "🥤");
      eq(tapIcon({name: "t195water", raw: ""}), "🥤");
      eq(tapIcon({name: "t195water", raw: "💧"}), "💧", "a day's own icon still comes first");
    }));
  test("#195 the tracker's page shows its settings to pick from, the style under the chart, and a preview", () =>
    withTrackers(drinks, async () => {
      setTrackerChart("t195water", "Drinks");
      setTrackerChart("t195coffee", "Drinks");
      const at = ensureTrackerPage("t195coffee");
      openPageIn(at.space, at.path);
      await settle();
      const box = content().querySelector(".pfacts.trkset");
      ok(box && !box.classList.contains("folded"), "the settings are open");
      ok(!box.querySelector(".pfhead"), "nothing to fold");
      const keys = [...box.querySelectorAll(".pfact .fkey")].map(k => k.textContent);
      for (const k of ["icon", "colour", "chart", "style"]) ok(keys.includes(k), k + " is there: " + keys);
      const style = [...box.querySelectorAll(".pfact")].find(l => l.querySelector(".fkey").textContent === "style");
      ok(style.classList.contains("fsub"), "style sits under the chart");
      has(style.textContent, "Applies to the whole Drinks chart.");
      eq([...style.querySelectorAll(".ftrk")].map(p => p.textContent), ["Stacked bar", "Side-by-side bar", "Line"]);
      ok(!box.querySelector("[disabled]"), "nothing greyed out");
      eq(box.querySelectorAll(".ftrk.fon").length, 4, "one in use for each");
      has(content().querySelector(".trkpageline").textContent, "tracker-t195coffee_i");
      ok(content().querySelector(".trkshared .trkdays"), "the Drinks chart as a preview");
      go("today");
    }));
  test("#195 ⋯ on a tracker's card opens its page", () =>
    withTrackers(drinks, async () => {
      const card = trackerCard(trackerGroup("t195water"));
      ok(!/Stop tracking|Rename/.test(card.textContent), "those are on the page now");
      card.querySelector(".trkmore").click();
      await settle();
      eq(state.pagePath, trackerPagePath("t195water"));
      ok(V.pages.has(trackerPagePath("t195water")), "made on the way");
      go("today");
    }));
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
     Natural planning (#189)
     ============================================================ */
  const npmReset = () => { NPM = null; state.planPath = null; NPM_QUEUE = []; closeModal(); };
  const npmPress = (key, code = key) => document.dispatchEvent(new KeyboardEvent("keydown", {key, code, bubbles: true}));
  const npmEnter = box => box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
  const npmTitles = blocks => (blocks || []).map(b => (b.state ? b.state + " " : "") + b.title);
  test("#189 natural planning writes the page in one change, reads it back in, shows the plan on it, and Undo takes it back", async () => {
    npmReset();
    const path = scratchProject("Newsletter");
    npmOpen(V.space, path);
    await settle();
    eq(state.view, "plan", "the wizard is open");
    ok(content().querySelector(".solsteps"), "the steps down the side");
    const box = content().querySelector(".npmin");
    box.value = "Keep customers close";
    npmEnter(box);
    await settle();
    eq(NPM.purpose, ["Keep customers close"], "Enter adds the line");
    Object.assign(NPM, {onpurpose: ["They read it because it helps"], principles: ["Useful before promotional", "One a month"],
      vision: ["Customers reply to it"], know: ["40% open it"], outcome: "A monthly newsletter goes out and 40% open it",
      people: ["Sofia Berg"], peopleDone: true});
    NPM.ideas = ["Export CRM emails", "Draft subject lines", "Order flowers", "Competitor examples", "Translate it", "Who writes it?"]
      .map(t => ({id: uid(), t, to: null}));
    npmGo(3);
    await settle();
    ok(content().querySelector(".npmsol"), "the numpad table");
    const name = async (key, words) => {
      npmPress(key, "Numpad" + key);
      await settle();
      const input = content().querySelector(".npmsol .npmin");
      ok(input, "a box to name the component in " + key);
      input.value = words;
      npmEnter(input);
      await settle();
    };
    await name("7", "Mailing list");
    await name("8", "Template");
    eq(NPM.comps.map(c => c.name), ["Mailing list", "Template"]);
    npmPress("6", "Digit6");
    await settle();
    eq(NPM.ideas.find(i => i.t === "Order flowers").to, "next", "6 is a next action");
    npmPress("Backspace");
    await settle();
    eq(NPM.ideas.find(i => i.t === "Order flowers").to, null, "Backspace undoes the sort");
    for (const k of ["3", "1", "2", "6"]) { npmPress(k, "Numpad" + k); await settle(); }
    eq(npmUnsorted().length, 0, "every idea has a place");
    NPM.comps[1].after = NPM.comps[0].id;
    eq(npmItems().map(it => it.kind === "comp" ? it.c.name : it.i.t), ["Mailing list", "Who writes it?"], "a component that waits gets no action yet");
    const ctx = contextList()[0];
    NPM.comps[0].act = {who: "", ctx, text: "Ask Sofia which field holds consent"};
    NPM.ideas.find(i => i.t === "Who writes it?").act = {who: "Lars Haugen", text: "Lars says who writes it"};
    npmWrite();
    await settle();
    eq(NPM, null, "the wizard closes");
    eq(npmDraft(V.space, path), null, "and its draft goes");
    const page = getPage(path);
    eq(page.props.outcome, "A monthly newsletter goes out and 40% open it");
    eq(page.props.purpose, "Keep customers close");
    eq(page.props.with, "[[p/Sofia Berg]]");
    eq(page.props.planned, T());
    eq(npmTitles(page.blocks).filter(t => t.startsWith("## ")),
      ["## Purpose & principles", "## Outcome", "## Components", "## Support", "## Later", "## Brainstorm"]);
    const sec = h => page.blocks.find(b => b.title === h);
    eq(npmTitles(sec("## Purpose & principles").children), ["Why: Keep customers close", "Must achieve: They read it because it helps", "Principles"]);
    eq(npmTitles(sec("## Purpose & principles").children[2].children), ["Useful before promotional", "One a month"]);
    eq(npmTitles(sec("## Outcome").children), ["Wild success: Customers reply to it", "How I'll know: 40% open it"]);
    const [c1, c2] = sec("## Components").children;
    eq(c1.title, "### 1. Mailing list");
    eq(npmTitles(c1.children), ["Export CRM emails", "TODO Ask Sofia which field holds consent [[c/" + ctx + "]]"]);
    eq([c2.title, c2.props.after], ["### 2. Template", "1. Mailing list"]);
    const wait = page.blocks.find(b => b.state === "WAIT");
    ok(wait && wait.props.assigned === "Lars Haugen", "somebody else's step waits on them");
    ok(sec("## Brainstorm").collapsed && sec("## Brainstorm").children.length === 6, "the brainstorm keeps every idea, folded");
    eq(npmTitles(sec("## Later").children), ["Translate it"]);
    // Planning again starts from the page.
    const d = npmFromPage(V.space, path);
    eq(d.comps.map(c => c.name), ["Mailing list", "Template"]);
    eq(d.comps[1].after, d.comps[0].id, "after:: is read back");
    eq([d.purpose, d.onpurpose, d.principles, d.know], [["Keep customers close"], ["They read it because it helps"], ["Useful before promotional", "One a month"], ["40% open it"]]);
    eq(d.ideas.filter(i => !i.to).length, 0, "nothing is dealt again");
    ok(d.ideas.some(i => i.t === "Order flowers" && i.to === "trash"), "what was not needed stays so");
    eq(d.ideas.find(i => i.t === "Competitor examples").to, "support");
    ok(npmKept(d.comps[0]), "its next action is kept as it is");
    // The plan on the page.
    openPage(path);
    await settle();
    const panel = content().querySelector(".npmpanel");
    ok(panel, "the plan panel");
    has(panel.textContent, "✓ A monthly newsletter goes out");
    has(panel.textContent, "Useful before promotional · One a month");
    has(panel.textContent, "Ask Sofia which field holds consent");
    has(panel.textContent, "1. Mailing list");
    has(panel.textContent, "after 1");
    has(content().querySelector(".pagehead").textContent, "✦ Re-plan");
    undoLast();
    ok(!getPage(path).props.planned && getPage(path).props.outcome !== "A monthly newsletter goes out and 40% open it" &&
      !getPage(path).blocks.some(b => npmHeadOf(b)), "Undo takes the whole plan back");
    npmReset();
  });
  test("#189 Finish writes only what was answered, and leaves the page's other lines alone", async () => {
    npmReset();
    const path = scratchProject("Keep my lines", [["TODO", "Call the bank"]]);
    npmOpen(V.space, path);
    await settle();
    NPM.outcome = "The bank account is moved over";
    npmWrite();
    const page = getPage(path);
    eq(npmTitles(page.blocks), ["TODO Call the bank"]);
    eq(page.props.outcome, "The bank account is moved over");
    npmReset();
  });
  test("#189 Organise with no ideas says so and goes back to the brainstorm; a skipped step has no ✓", async () => {
    npmReset();
    const path = scratchProject("Nothing to sort");
    npmOpen(V.space, path);
    await settle();
    npmGo(3);
    await settle();
    ok(!content().querySelector(".npmsol"), "no table of boxes that do nothing");
    ok(content().querySelector(".npmnone"), "it says there is nothing to sort");
    ok(!/0 of 0/.test(content().querySelector(".npmq").textContent), "no 0 of 0 left");
    const steps = [...content().querySelectorAll(".solstep")];
    ok(!steps[2].classList.contains("done"), "the skipped brainstorm has no ✓");
    [...content().querySelectorAll("button")].find(b => b.textContent === "‹ Brainstorm").click();
    await settle();
    eq(NPM_STEPS[NPM.step].k, "brainstorm");
    npmReset();
  });
  test("#189 the outcome box says when a line reads like a topic", async () => {
    npmReset();
    const path = scratchProject("Garden");
    npmOpen(V.space, path);
    await settle();
    eq(npmOutcomeSay("Garden")[0], "warn");
    eq(npmOutcomeSay(pageTitle(path))[0], "warn", "the project's own name");
    eq(npmOutcomeSay("The garden is dug and sown")[0], "ok");
    npmReset();
  });
  test("#189 the draft is kept beside the project, and in a shared area somebody else takes it over", async () => {
    npmReset();
    const path = scratchProject("Shared plan");
    npmOpen(V.space, path);
    await settle();
    NPM.purpose = ["So we stop guessing"];
    npmSave();
    await npmFileWrite(JSON.parse(JSON.stringify(NPM)));
    const rec = LOADED.get(V.space), file = npmDraftPath(path);
    has(rec.drafts.get(file), "So we stop guessing");
    ok(isNpmDraftPath(file) && !V.pages.has(file), "the draft is no page");
    // Somebody else carried on with it later.
    const theirs = Object.assign(npmDraftRead(rec.drafts.get(file)), {by: "Lars Haugen", at: "2999-01-01T00:00:00Z", step: 1});
    rec.drafts.set(file, npmDraftText(theirs));
    NPM = null;
    npmOpen(V.space, path);
    await settle();
    ok(npmLocked(), "theirs until taken over");
    const lock = content().querySelector(".npmlock");
    has(lock.textContent, "Lars Haugen is planning this project");
    ok(!content().querySelector(".npmfinish"), "no Finish on somebody else's draft");
    lock.querySelector("button").click();
    await settle();
    ok(!npmLocked() && samePerson(NPM.by, whoAmI()), "taken over");
    eq(NPM.step, 1, "where they were");
    npmThrowAway();
    eq(npmDraft(V.space, path), null, "thrown away");
    ok(!rec.drafts.has(file), "the file too");
    npmReset();
  });
  test("#189 a new project offers the plan: 1 plans it, Esc leaves the page open, Don't ask again goes to the outcome", async () => {
    npmReset();
    PREF.set("npm.ask:" + V.space, "1");
    createProjectFlow("Test npm fresh one");
    await settle();
    has(document.querySelector("#modalRoot").textContent, "Plan it now");
    eq(state.view, "page", "the page is open behind it");
    npmPress("Escape");
    await settle();
    ok(!document.querySelector("#modalRoot").firstChild, "Esc closes it");
    eq(state.view, "page", "and leaves the page");
    createProjectFlow("Test npm fresh two");
    await settle();
    npmPress("1");
    await settle();
    eq(state.view, "plan", "1 plans it");
    eq(pageTitle(NPM.path), "Test npm fresh two");
    npmReset();
    PREF.set("npm.ask:" + V.space, "0");
    createProjectFlow("Test npm fresh three");
    await settle();
    has(document.querySelector("#modalRoot").textContent, "What does done look like?");
    closeModal();
    PREF.set("npm.ask:" + V.space, "1");
  });
  test("#189 the review's next-action question offers Re-plan it, which waits until the review is done", async () => {
    npmReset();
    const path = scratchProject("Fuzzy thing");
    const acts = solDeal({space: V.space, path}, solFields().find(x => x.k === "next"));
    ok(acts.some(a => a.label === "✦ Re-plan it"), "an answer of its own");
    npmQueue(V.space, path);
    go("plan", {planPath: null});
    await settle();
    has(content().querySelector(".npmqueue").textContent, pageTitle(path));
    npmReset();
    go("today");
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
  test("#184 the tour's tick-off prompt starts with nothing ticked", async () => {
    const step = {path: "x.md", block: {title: "Meet [[go/people]]", state: "TODO"}, dest: "people"};
    askTourCheckoff([step]);
    const toast = [...$("#toasts").children].pop();
    try {
      const box = toast.querySelector("input[type=checkbox]");
      const ok = [...toast.querySelectorAll("button")].find(b => b.textContent === "Tick these off");
      eq(box.checked, false);
      eq(ok.disabled, true);
      box.checked = true;
      box.dispatchEvent(new Event("change"));
      eq(ok.disabled, false);
    } finally { toast.remove(); PREF.set("tour.asked", ""); }
  });
  test("#186 Getting started stays while a step it shows is still open", async () => {
    const keys = ["coach", "coach.who", "coach.where", "coach.add", "coach.project", "coach.tour"];
    const was = keys.map(k => PREF.get(k, ""));
    const had = !!tourProjectPath();
    const tour = seedTourProject();
    TOUR_PATH_CACHE = undefined;
    try {
      PREF.set("coach", "1");
      for (const k of ["who", "where", "add"]) PREF.set("coach." + k, "1");
      PREF.set("coach.tour", "");
      go("today");
      await settle();
      ok(content().querySelector(".coach:not(.tip)"), "the strip went while the tour step was open");
      eq(PREF.get("coach"), "1");
      PREF.set("coach.project", "1");
      PREF.set("coach.tour", "1");
      render();
      await settle();
      ok(!content().querySelector(".coach:not(.tip)"), "the strip stayed with every step done");
      eq(PREF.get("coach"), "0");
    } finally {
      keys.forEach((k, i) => PREF.set(k, was[i]));
      if (!had) removePage(tour);
      TOUR_PATH_CACHE = undefined;
      render();
    }
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
     Sense where I am (#183)
     ============================================================ */
  const home = {ctx: "home", lat: 59.9139, lon: 10.7522, r: 150};
  const shop = {ctx: "shop", lat: 59.9200, lon: 10.7600, r: 150};
  const sensed = over => guessContext(Object.assign(
    {device: "phone", net: "", pos: null, places: [home, shop], here: "home", away: "errand"}, over));
  test("#183 metres between two points", () => {
    eq(Math.round(senseMetres(home, home)), 0);
    const m = senseMetres(home, {lat: home.lat + 0.001, lon: home.lon});
    ok(m > 105 && m < 117, "0.001 degrees north is about 111 m, got " + m);
  });
  test("#183 a saved place wins, the nearest one", () => {
    eq(sensed({pos: {lat: 59.9140, lon: 10.7523, acc: 20}, net: "cellular"}).ctx, "home");
    eq(sensed({pos: {lat: 59.9199, lon: 10.7599, acc: 20}}).ctx, "shop");
    has(sensed({pos: {lat: 59.9140, lon: 10.7523, acc: 20}}).why, "@home");
  });
  test("#183 a phone off wifi, or far from every place, is out and about", () => {
    eq(sensed({net: "cellular"}).ctx, "errand");
    eq(sensed({net: "none"}).ctx, "errand");
    eq(sensed({pos: {lat: 60.5, lon: 11, acc: 20}, net: "wifi"}).ctx, "errand");
  });
  test("#183 otherwise you are where you usually are on the device", () => {
    eq(sensed({net: "wifi"}).ctx, "home");
    eq(sensed({}).ctx, "home", "the browser does not say what network");
    eq(sensed({device: "pc", here: "computer", net: "none"}).ctx, "computer", "a PC is never out and about");
    eq(sensed({here: "", away: ""}), null);
  });
  test("#183 work hours come after places and out and about, before the device", () => {
    const work = {ctx: "office", days: [1, 2, 3, 4, 5], from: "08:00", to: "16:00"};
    const wed10 = new Date(2026, 9, 28, 10, 0), wed17 = new Date(2026, 9, 28, 17, 0), sat10 = new Date(2026, 9, 31, 10, 0);
    eq(sensed({device: "pc", here: "computer", work, now: wed10}).ctx, "office");
    has(sensed({device: "pc", here: "computer", work, now: wed10}).why, "work hours");
    eq(sensed({device: "pc", here: "computer", work, now: wed17}).ctx, "computer", "after work");
    eq(sensed({device: "pc", here: "computer", work, now: sat10}).ctx, "computer", "a Saturday");
    eq(sensed({work, now: wed10, pos: {lat: 59.9140, lon: 10.7523, acc: 20}}).ctx, "home", "a saved place wins");
    eq(sensed({work, now: wed10, net: "cellular"}).ctx, "errand", "out and about wins");
    eq(sensed({device: "pc", here: "computer", work: Object.assign({}, work, {ctx: ""}), now: wed10}).ctx, "computer", "no context, no rule");
  });
  test("#183 a night shift runs past midnight and counts as the day it began", () => {
    const night = {ctx: "ward", days: [5], from: "22:00", to: "06:00"};
    ok(inWorkHours(night, new Date(2026, 9, 30, 23, 0)), "Friday 23:00");
    ok(inWorkHours(night, new Date(2026, 9, 31, 2, 0)), "Saturday 02:00 is Friday's shift");
    ok(!inWorkHours(night, new Date(2026, 9, 31, 23, 0)), "Saturday 23:00 is not a shift");
    ok(!inWorkHours(night, new Date(2026, 9, 30, 2, 0)), "Friday 02:00 is Thursday's, not set");
  });
  test("#183 the setup asks for work hours and keeps them", async () => {
    const was = PREF.get("sense.work", "");
    PREF.set("sense.work", JSON.stringify({ctx: "office", days: [1, 3], from: "09:00", to: "15:00"}));
    openSenseSetup();
    await settle();
    const dlg = document.querySelector("#modalRoot .modal");
    has(dlg.textContent, "In work hours you are at");
    eq([...dlg.querySelectorAll(".sensedays button.on")].map(b => +b.dataset.d), [1, 3]);
    dlg.querySelector(".sensedays button[data-d='5']").click();
    const keepSet = PREF.get("sense.set", "");
    const saveBtn = [...dlg.querySelectorAll(".foot button")].find(b => b.textContent === "Save and sense");
    const realNow = window.senseNow;
    try {
      senseNow = () => {};
      saveBtn.click();
    } finally { senseNow = realNow; }
    const saved = JSON.parse(PREF.get("sense.work", "{}"));
    eq(saved.ctx, "office"); eq(saved.days, [1, 3, 5]); eq(saved.from, "09:00"); eq(saved.to, "15:00");
    PREF.set("sense.work", was);
    PREF.set("sense.set", keepSet);
  });
  test("#183 defaults follow the contexts you already have", () => {
    const had = ["computer", "home", "errand"].filter(c => contextList().includes(c));
    eq(senseDefault("pc"), had.includes("computer") ? "computer" : SENSE_DEFAULTS.pc.find(c => contextList().includes(c)) || "computer");
    ok(SENSE_DEFAULTS.away.includes(senseDefault("away")), "away is one of the usual words");
    eq(senseName(" @Garden "), "Garden");
    eq(senseName("  "), "", "nothing typed is not Untitled");
  });
  test("#183 Sense it is on Contexts and g l, and the first time it asks", async () => {
    const was = PREF.get("sense.set", "");
    PREF.set("sense.set", "");
    go("contexts");
    await settle();
    ok(content().querySelector(".vhead-r .sense"), "Sense it on Contexts");
    ok(CHORDS["g l"], "g l");
    CHORDS["g l"]();
    await settle();
    const dlg = document.querySelector("#modalRoot .modal");
    ok(dlg, "the setup opens");
    has(dlg.textContent, "Sense where I am");
    has(dlg.textContent, "Save this spot");
    eq(dlg.querySelectorAll("input")[0].value, senseHere(), "the device's context is filled in");
    closeModal();
    PREF.set("sense.set", was);
    go("today");
  });
  test("#183 switching by itself sets the context without leaving the screen", async () => {
    const keep = ["sense.on", "sense.auto", "sense.set", "sense.device", "sense.here", "sense.places"].map(k => [k, PREF.get(k, "")]);
    const ctxWas = state.context;
    try {
      for (const [k, v] of [["sense.on", "1"], ["sense.auto", "1"], ["sense.set", T()], ["sense.device", "pc"], ["sense.here", "computer"], ["sense.places", "[]"]]) PREF.set(k, v);
      state.context = null;
      go("projects", {sub: "list"});
      if (document.activeElement) document.activeElement.blur();
      SENSE_AT = 0;
      await senseQuietly();
      eq(state.context, "computer");
      eq(state.view, "projects", "the screen stays");
      ok(!document.querySelector("#btnContext").hidden, "the chip shows it");
    } finally {
      for (const [k, v] of keep) PREF.set(k, v);
      state.context = ctxWas;
      setSetting("current_context", ctxWas || "");
      renderContextChip();
      go("today");
    }
  });

  /* ============================================================
     Events, feelings and Reflect: the bullet journal (#185)
     ============================================================ */
  // Day pages n days back with these lines on them, and no intentions, put back afterwards.
  const withWeek = async (days, fn) => {
    const saved = new Map([[INTENTIONS_PATH, null]].concat(days.map(([n]) => [journalPath(shiftISO(T(), -n)), null])));
    for (const p of saved.keys()) saved.set(p, V.pages.has(p) ? structuredClone(getPage(p)) : null);
    try {
      V.pages.delete(INTENTIONS_PATH);
      for (const [n, text] of days) putPage(journalPath(shiftISO(T(), -n)), parsePage(text));
      clearMemo();
      await fn();
    } finally {
      for (const [p, page] of saved) if (page) putPage(p, page); else V.pages.delete(p);
      clearMemo();
      go("today");
    }
  };
  test("#185 o and = start an event and a feeling, never a to do", () => {
    eq(bujoKind("o Ran 5 km"), "ev");
    eq(bujoKind("○ Ran 5 km"), "ev");
    eq(bujoKind("= Light, proud"), "feel");
    eq(bujoKind("o Ran", "TODO"), null, "a task is a task");
    for (const t of ["only words", "o", "=12 counted", "obvious"]) eq(bujoKind(t), null, t);
    eq(bujoText("o Ran 5 km"), "Ran 5 km");
    eq(bujoText("= o Light"), "o Light", "only the first mark");
    ok(!dayCandidate(newBlock({title: "o Ran 5 km"})), "an event is offered as a to do");
    ok(!dayCandidate(newBlock({title: "= Drained"})), "a feeling is offered as a to do");
    ok(dayCandidate(newBlock({title: "Ran 5 km"})), "a plain line is still asked about");
  });
  test("#185 an event and a feeling draw a quiet dot, without their mark", async () => {
    const path = join(PAGES, "Test bujo lines.md");
    putPage(path, parsePage("- o Ran 5 km\n  - = Light, proud\n- Plain line\n"));
    clearMemo();
    try {
      openPage(path);
      await settle();
      const [ev] = getPage(path).blocks, feel = ev.children[0];
      const line = b => document.querySelector('.blk[data-id="' + b.id + '"] > .line');
      ok(line(ev).classList.contains("ev"), "the event's line is .ev");
      eq(line(ev).querySelector(".txt").textContent, "Ran 5 km");
      ok(line(feel).classList.contains("feel"), "the feeling's line is .feel");
      eq(line(feel).querySelector(".txt").textContent, "Light, proud");
      ok(!line(ev).querySelector(".tick"), "no tick on an event");
      has(serializePage(getPage(path)), "\n- o Ran 5 km\n  - = Light, proud", "the file keeps the marks");
    } finally { V.pages.delete(path); clearMemo(); go("today"); }
  });
  test("#185 · and a space turns a note into a to do as it is typed", async () => {
    const path = join(PAGES, "Test bujo dot.md");
    putPage(path, parsePage("- \n"));
    clearMemo();
    try {
      openPage(path);
      await settle();
      const b = getPage(path).blocks[0];
      const txt = document.querySelector('.blk[data-id="' + b.id + '"] .txt');
      txt.focus();
      txt.textContent = "· Book next week's run";
      txt.dispatchEvent(new Event("input"));
      eq(b.state, "TODO", "a to do at once");
      eq(b.title, "Book next week's run");
      ok(document.querySelector('.blk[data-id="' + b.id + '"] > .line > .tick'), "with its tick");
    } finally { V.pages.delete(path); clearMemo(); go("today"); }
  });
  test("#185 Reflect is a step and a tab only with something to reflect on", async () => {
    const step = () => reviewSteps().flatMap(g => g.steps).find(s => s.doors.includes("reflect"));
    await withWeek([], async () => {
      ok(!reflectWanted(), "no intentions and no events, yet Reflect is wanted");
      ok(!step(), "the step is there with nothing to reflect on");
      ok(!subShown("review", "reflect"), "the tab is there with nothing to reflect on");
    });
    await withWeek([[2, "- o Ran 5 km\n  - = Light\n"]], async () => {
      ok(step(), "no Reflect step with an event this week");
      // A list of its own without the step gets it last; the built-in one has it under CREATIVE.
      const all = reviewSteps().flatMap(g => g.steps);
      eq(all[all.length - 1], step(), "last in the vault's own list");
      const own = getPage(REVIEW_LIST_PATH);
      V.pages.delete(REVIEW_LIST_PATH);
      try { eq(reviewSteps().find(g => g.steps.some(s => s.doors.includes("reflect"))).title, "CREATIVE"); }
      finally { if (own) putPage(REVIEW_LIST_PATH, own, {silent: true}); clearMemo(); }
      ok(subShown("review", "reflect"), "no Reflect tab");
      eq(reviewDoorCount("reflect"), "1 this week");
    });
  });
  test("#185 the week: events with what is under them, lone feelings, and lines a feeling hangs under", async () => {
    await withWeek([
      [1, "- o Budget meeting with Ola\n  - = Drained\n  - TODO Block Friday afternoons\n- Lunch\n  - = Restless\n" +
          "- = Tired all morning\n- Plain note\n  - plain under it\n"],
      [8, "- o Too long ago\n"],
    ], async () => {
      const log = reflectLog();
      eq(log.map(d => d.day), [shiftISO(T(), -1)], "only the last seven days");
      eq(log[0].items.map(b => b.title), ["o Budget meeting with Ola", "Lunch", "= Tired all morning"]);
      go("review", {sub: "reflect"});
      await settle();
      eq(content().querySelectorAll(".reflog .refitem").length, 3, "one row per entry");
      ok(content().querySelector(".reflog .bl-line.ev"), "the event drawn as one");
    });
  });
  test("#185 Toward and Away are one pick, written under this week's #reflection line", async () => {
    await withWeek([[0, "- o Ran 5 km with Alice\n"]], async () => {
      const today = journalPath(T()), ev = getPage(today).blocks[0];
      const pills = async () => { go("review", {sub: "reflect"}); await settle(); return [...content().querySelectorAll(".refpick .fchip")]; };
      const picks = () => (reflectionBlock(false)?.block.children || []).map(b => b.title);
      (await pills())[0].click();
      const id = blockProp(ev, "id");
      ok(id, "the event got an id:: to be pointed at");
      eq(reflectionBlock(false).block.title, "#reflection Week " + isoWeek(T())[0]);
      eq(picks(), ["toward:: ((" + id + "))"]);
      eq((await pills())[0].getAttribute("aria-pressed"), "true", "Toward is shown as picked");
      eq(content().querySelector(".refnotes .bref").textContent, "Ran 5 km with Alice", "the pick reads as the event, without its o");
      (await pills())[1].click();
      eq(picks(), ["away:: ((" + id + "))"], "Away takes its place");
      (await pills())[1].click();
      eq(picks(), [], "picking Away again takes it back");
      ok(content().querySelector(".refnotes .blk"), "the week's line is there to write under");
      has(serializePage(parsePage(serializePage(getPage(today)))), "#reflection Week", "kept in the file");
    });
  });
  test("#185 an intention typed in Reflect is a horizon page, and shows in Horizons", async () => {
    await withWeek([], async () => {
      go("review", {sub: "reflect"});
      await settle();
      const input = content().querySelector(".refaims input");
      input.value = "Protect deep-work energy";
      input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
      eq(intentions(), ["Protect deep-work energy"]);
      ok(isHorizonPage(INTENTIONS_PATH), "Intentions.md is type:: horizon");
      ok(reflectWanted(), "intentions alone make Reflect a step");
      delete getPage(INTENTIONS_PATH).props.type;
      migrateCancelled();
      ok(V.pages.has(INTENTIONS_PATH), "a hand-written Intentions.md was moved to cancelled");
      go("horizons", {horizonArea: Spaces.active});
      await settle();
      has(content().textContent, "Protect deep-work energy", "Horizons");
    });
  });
  test("#185 an event and its feeling show under the person it links to", () => {
    const path = join(PAGES, "Test bujo backlink.md");
    putPage(path, parsePage("- o Lunch with [[p/Lars Haugen]]\n  - = Glad we talked\n"));
    clearMemo();
    try {
      const sec = backlinksSection(personPath("Lars Haugen"));
      ok(sec && sec.querySelector(".bl-line.ev"), "the event among the linked references");
      const feel = sec.querySelector(".bl-line.feel");
      ok(feel, "its feeling under it");
      eq(feel.querySelector(".bl-txt").textContent, "Glad we talked");
    } finally { V.pages.delete(path); clearMemo(); }
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
