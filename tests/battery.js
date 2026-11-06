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
  test("version is MAJOR.MINOR.PATCH and shown beside the name, top left", () => {
    ok(/^\d+\.\d+\.\d+$/.test(APP_VERSION), "APP_VERSION is " + APP_VERSION);
    eq(document.querySelector("#appVersion").textContent, "v" + APP_VERSION);
    has(document.querySelector("#brand").textContent, "GroupToDo");
  });

  /* ============================================================
     Updates and what's new (#256)
     ============================================================ */
  const fakeLog = v => "# Changelog\n\n## " + v + " - 2026-12-01\n\n- Shiny thing (#999): it shines.\n- Another: it also does.\n\n" +
    "## " + APP_VERSION + " - 2026-11-02\n\n- Old news: already here.\n";
  const withFetch = async (text, fn) => {
    const real = window.fetch;
    const asked = [];
    window.fetch = async url => { asked.push(String(url)); return new Response(text, {status: 200}); };
    try { return await fn(asked); } finally { window.fetch = real; }
  };
  const clearNews = () => { document.querySelectorAll("#toasts .toast.update, #toasts .toast.whatsnew").forEach(t => t.remove()); closeModal(); };
  test("#256 versions compare by number, not by text", () => {
    ok(verCmp("1.10.0", "1.9.9") > 0, "1.10.0 > 1.9.9");
    ok(verCmp("2.0.0", "2.0.0") === 0, "equal");
    ok(verCmp("1.69.0", "1.70.0") < 0, "1.69.0 < 1.70.0");
  });
  test("#256 the news reads this version first, with its heads and issues", () => {
    const e = newsEntries(HELP_NEWS);
    eq(e[0].version, APP_VERSION);
    ok(e.length > 5, "more than five versions kept, so a gap can be bridged");
    const it = newsEntries(fakeLog("9.0.0"))[0].items[0];
    eq([it.head, it.issue], ["Shiny thing", "999"]);
  });
  test("#256 the demo never asks GitHub", () => ok(!updatesPossible(), "updatesPossible() in the demo"));
  test("#256 the page policy lets the update check reach GitHub", () => {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
    has(csp.match(/connect-src[^;]*/)[0], new URL(REPO_RAW).origin);
  });
  test("#256 a newer version on GitHub gets a toast and a badge", async () => {
    clearNews();
    await withFetch(fakeLog("9.0.0"), async asked => {
      const u = await checkForUpdate();
      has(asked[0], "raw.githubusercontent.com/kennethaar/GroupTodo/main/CHANGELOG.md");
      eq(u && u.version, "9.0.0");
      eq(u.entries.length, 1, "only the versions newer than this one");
    });
    const t = document.querySelector("#toasts .toast.update");
    ok(t, "update toast");
    has(t.textContent, "v9.0.0");
    has(t.textContent, "Shiny thing");
    has(t.textContent, "Download now");
    const b = document.querySelector("#appUpdate");
    ok(!b.hidden, "badge shown");
    has(b.textContent, "New v9.0.0");
    eq(PREF.get("update.checked"), T(), "checked today, so not again until tomorrow");
    clearNews();
  });
  test("#256 the newest version gets no toast, and the badge goes", async () => {
    clearNews();
    await withFetch(fakeLog("1.0.0"), () => checkForUpdate());
    eq(UPDATE, null);
    ok(document.querySelector("#appUpdate").hidden, "badge hidden");
    ok(!document.querySelector("#toasts .toast.update"), "no toast");
  });
  test("#256 a new version's first start says what came since the last one", () => {
    clearNews();
    const before = newsEntries(HELP_NEWS)[3].version;
    PREF.set("onboarded", PREF.get("onboarded") || T());
    PREF.set("ran.version", before);
    maybeShowWhatsNew();
    const t = document.querySelector("#toasts .toast.whatsnew");
    ok(t, "what's new toast");
    has(t.textContent, "since v" + before);
    eq(PREF.get("ran.version"), APP_VERSION);
    t.remove();
    maybeShowWhatsNew();
    ok(!document.querySelector("#toasts .toast.whatsnew"), "only once per version");
  });
  test("#256 what's new lists each version since, with help and a way to give feedback", () => {
    const all = newsEntries(HELP_NEWS);
    whatsNewDialog(all.slice(0, 3), {since: all[3].version});
    const m = document.querySelector(".modal .whatsnew");
    ok(m, "dialog");
    for (const e of all.slice(0, 3)) has(m.textContent, "v" + e.version);
    ok(!m.textContent.includes("v" + all[3].version + " ·"), "not the version you had");
    ok(m.querySelectorAll(".newsacts button").length > 0, "How it works for at least one new thing");
    const idea = m.querySelector('.feedback a[href*="/issues/new"]');
    ok(idea, "suggest a feature");
    has(decodeURIComponent(idea.href), "GroupToDo v" + APP_VERSION);
    closeModal();
  });

  /* ============================================================
     Start-up and the demo vault
     ============================================================ */
  test("app finished starting with the demo vault", () => {
    ok(INIT_DONE && V.loaded, "INIT_DONE and V.loaded");
    ok(getPage(join(DIRS.orgs, "Nordvik Shipping.md")), "demo org Nordvik Shipping");
    ok(getPage(personPath("Lars Haugen")), "demo person Lars Haugen");
    ok(getPage(journalPath(T())) || allPages().some(p => pageKind(p) === "journal"), "a journal page");
    eq(whoAmI(), "Kenneth Aar", "identity is the demo user");
  });

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
  test("#168 on a phone the area button sits at the end of the meeting's row, not on a row of its own", async () => {
    for (const w of [390, 340]) {
      const {f, d} = await phoneBar(w, "at 12:00", "home");
      try {
        const sp = d.querySelector("#spacesBtn").getBoundingClientRect(), mt = d.querySelector("#nextMeet").getBoundingClientRect();
        const cap = d.querySelector(".capture").getBoundingClientRect();
        ok(sp.top < mt.bottom && sp.bottom > mt.top, w + "px: the area button is on the meeting's row");
        ok(sp.left >= d.querySelector("#btnContext").getBoundingClientRect().right, w + "px: after the @context");
        ok(mt.top >= cap.bottom, w + "px: under the capture field");
        ok(d.querySelector("header.top").getBoundingClientRect().height < 110, w + "px: two rows, not three");
        ok(d.documentElement.scrollWidth <= w, w + "px: nothing wider than the phone");
      } finally { f.remove(); }
    }
  });
  test("#168 on a phone ⇧ Send is not in the bar but first in the area menu", async () => {
    const {f, d} = await phoneBar(390, "at 12:00", "home");
    try {
      const send = d.querySelector("#btnSend");
      send.hidden = false;
      eq(getComputedStyle(send).display, "none", "no ⇧ in the bar on a phone");
    } finally { f.remove(); }
    const was = window.sendInAreaMenu;
    window.sendInAreaMenu = () => true;
    try {
      openSpacesMenu();
      const first = $("#spop").firstElementChild;
      ok(first.classList.contains("spsend"), "Send is the menu's first row");
      has(first.textContent, "Send the vault file");
      window.sendInAreaMenu = () => false;
      openSpacesMenu();
      ok(!$("#spop .spsend"), "not in the menu where the bar has ⇧");
    } finally { window.sendInAreaMenu = was; closeSpacesMenu(); }
  });
  test("#168 on a phone with no meeting or context the bar is one row", async () => {
    const {f, d} = await phoneBar(390, null, null);
    try {
      eq(getComputedStyle(d.querySelector(".hnow")).display, "none", "the empty row");
      ok(d.querySelector("header.top").getBoundingClientRect().height < 70, "the bar is one row");
    } finally { f.remove(); }
  });
  test("#168 the Journal shows no @context chip, so on a phone the area button is on the top row", async () => {
    const was = state.context;
    try {
      state.context = "home";
      go("today"); await settle();
      ok($("#btnContext").hidden, "the @context chip shows on the Journal");
      go("next"); await settle();
      ok(!$("#btnContext").hidden, "the @context chip is gone from Next too");
    } finally { state.context = was; go("today"); await settle(); }
  });
  test("on a phone the app opens on Next, on a wide screen on the Journal", async () => {
    const was = state.view;
    try {
      Object.defineProperty(PHONE, "matches", {configurable: true, get: () => true});
      eq(startView(), "next", "phone");
      await openSpace(V.space); await settle();
      eq(state.view, "next", "a phone opens the area on");
      delete PHONE.matches;
      eq(startView(), "today", "wide screen");
      await openSpace(V.space); await settle();
      eq(state.view, "today", "a wide screen opens the area on");
    } finally { delete PHONE.matches; go(was); await settle(); }
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
    const icon = k => [...card.querySelectorAll(".pfields.lines .pfield")].find(x => x.title.startsWith(k))
      ?.querySelector(".fi svg path")?.getAttribute("d");
    eq(icon("Organisations"), ICON.orgs.match(/d="([^"]+)"/)[1], "organisations use the sidebar's building");
    eq(icon("Next action"), ICON.next.match(/d="([^"]+)"/)[1], "the next action uses the sidebar's lightning bolt");
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

  test("#181 the month, then projects, contexts, people and orgs come in before the rest", async () => {
    const jp = d => join(JOURNALS, d + ".md");
    const old = shiftISO(T(), -40), five = shiftISO(T(), -5), yest = shiftISO(T(), -1);
    let release;
    const held = new Promise(r => { release = r; });
    const order = [];
    const tree = {
      journals: {[T() + ".md"]: "- today\n", [yest + ".md"]: "- yesterday\n", [five + ".md"]: "- five days ago\n", [old + ".md"]: "- old\n"},
      pages: {"GTD.md": "title:: GTD\n",
        "0": {"Done.md": "title:: Done\n"}, "2": {"Later.md": "title:: Later\n"},
        "1": {"Boat.md": "title:: Boat\n\n- TODO Sand the hull\n"},
        p: {"Tor Vik.md": "title:: Tor Vik\n\n- met at the fair\n"},
        c: {"phone.md": "title:: phone\n"}, o: {"Bakery.md": "title:: Bakery\n"}},
    };
    /* The contexts are held: what is in before them is shown, what follows is not. */
    const b = Backends.fs(fakeDir("Soon181", tree, [], {[old + ".md"]: held, "Done.md": held, "Later.md": held, "phone.md": held}));
    const read = b.readMany.bind(b);
    b.readMany = (paths, onEach) => read(paths, p => { order.push(p); if (onEach) onEach(p); });
    const rec = newRecord("Soon181", b);
    let shown = 0;
    try {
      await readInto(rec, {stage: true, onSoon: () => { shown++; }});
      has(serializePage(rec.pages.get(jp(T()))), "today", "today, in the first read");
      ok(!rec.pages.has(jp(yest)), "yesterday came in with today");
      for (let i = 0; i < 40 && shown < 2; i++) await settle();
      eq(shown, 2, "times shown: the month, then the projects");
      has(serializePage(rec.pages.get(jp(yest))), "yesterday", "yesterday, before the projects");
      ok(rec.pages.has(jp(five)), "a day this month, before the projects");
      has(serializePage(rec.pages.get(join(DIRS.active, "Boat.md"))), "Sand the hull", "the project, before the contexts");
      ok(rec.stubs.has(join(DIRS.contexts, "phone.md")), "the context is not a stand-in");
      ok(rec.stubs.has(personPath("Tor Vik")) && rec.stubs.has(join(DIRS.orgs, "Bakery.md")), "people and orgs came in before the contexts");
      ok(rec.pages.has(personPath("Tor Vik")) && !rec.pages.get(personPath("Tor Vik")).blocks.length, "the person is there by name");
      ok(rec.stubs.has(join(DIRS.completed, "Done.md")), "a done project came in early");
      ok(!rec.pages.has(jp(old)), "a day from over a month ago came in early");
      ok(navLoading(), "no bar while the rest is read");
    } finally { release(); }
    await filesLoaded();
    ok(!rec.stubs, "no stand-ins left");
    ok(!LOADING.has(rec.name), "the bar stays once all is in");
    has(serializePage(rec.pages.get(personPath("Tor Vik"))), "met at the fair", "the person, read in full");
    const at = p => order.indexOf(p);
    const dir = (d, n) => join(d, n);
    ok(at(jp(yest)) < at(dir(DIRS.active, "Boat.md")), "a day before the projects");
    ok(at(dir(DIRS.active, "Boat.md")) < at(dir(DIRS.contexts, "phone.md")), "projects before contexts");
    ok(at(dir(DIRS.contexts, "phone.md")) < at(personPath("Tor Vik")), "contexts before people");
    ok(at(personPath("Tor Vik")) < at(dir(DIRS.orgs, "Bakery.md")), "people before orgs");
    ok(at(dir(DIRS.orgs, "Bakery.md")) < at(dir(DIRS.someday, "Later.md")), "orgs before someday");
    ok(at(dir(DIRS.someday, "Later.md")) < at(dir(DIRS.completed, "Done.md")), "someday before done");
    ok(at(dir(DIRS.completed, "Done.md")) < at(jp(old)), "done before an old day");
  });
  test("#181 the month's days are read and shown on their own, before the projects and the people", async () => {
    const jp = d => join(JOURNALS, d + ".md");
    const five = shiftISO(T(), -5);
    let release;
    const held = new Promise(r => { release = r; });
    const tree = {
      journals: {[T() + ".md"]: "- today\n", [five + ".md"]: "- five days ago\n"},
      pages: {"GTD.md": "title:: GTD\n",
        "1": {"Boat.md": "title:: The boat\noutcome:: afloat\n\n- TODO Sand the hull\n"},
        p: {"Tor Vik.md": "title:: Tor Vik\n"}},
    };
    const rec = newRecord("Names181", Backends.fs(fakeDir("Names181", tree, [], {"Tor Vik.md": held})));
    const boat = join(DIRS.active, "Boat.md");
    let shown = 0;
    try {
      await readInto(rec, {stage: true, onSoon: () => { shown++; }});
      for (let i = 0; i < 40 && shown < 2; i++) await settle();
      eq(shown, 2, "times shown before the person is in");
      ok(!rec.stubs.has(boat), "the project is still a stand-in");
      eq(rec.pages.get(boat).props.title, "The boat", "the project's name");
      has(serializePage(rec.pages.get(boat)), "Sand the hull", "the project's next action");
      ok(rec.stubs.has(personPath("Tor Vik")), "the person came in with the projects");
      has(serializePage(rec.pages.get(jp(five))), "five days ago", "a day this week came in first");
    } finally { release(); }
    await filesLoaded();
    ok(!rec.stubs, "no stand-ins left");
    eq(shown, 3, "times shown before the rest");
  });
  test("#181 a project still a stand-in is a name, not a stuck project", async () => {
    const rec = newRecord("Stuck181", Backends.memory());
    const boat = join(DIRS.active, "Boat.md");
    const page = parsePage("");
    STUB_PAGES.add(page);
    rec.pages.set(boat, page); rec.stubs = new Set([boat]);
    LOADED.set(rec.name, rec);
    try {
      await inSpace(rec.name, async () => {
        eq(pageTitle(boat), "Boat", "the file name, without .md");
        ok(isStandIn(boat), "not seen as a stand-in");
        ok(!stuckActiveProjects().some(s => s.path === boat), "a stand-in is called stuck");
        ok(!stalestActiveProjects(99).some(s => s.path === boat), "a stand-in is called stale");
        rec.stubs = null; rec.pages.set(boat, parsePage("title:: Boat\n"));
        ok(!isStandIn(boat), "the real page is still a stand-in");
        ok(stuckActiveProjects().some(s => s.path === boat), "a project with nothing to do is not stuck");
      });
    } finally { LOADED.delete(rec.name); }
  });

  /* A pretend serve.py: fetch() is swapped for one that answers from a tree
     of paths, keeps a log of what was asked, and can hold a file back. */
  const fakeServer = async (files, body, {gate = {}, hang = false} = {}) => {
    const real = window.fetch, asked = [];
    window.fetch = async (url, opts = {}) => {
      const u = new URL(url, location.href), path = u.searchParams.get("path");
      asked.push(u.pathname.replace(/^.*\/api\//, "") + (path ? " " + path : ""));
      if (hang) return new Promise((_, rej) => opts.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError"))));
      if (/\/api\/ping$/.test(u.pathname)) return new Response(JSON.stringify({ok: true}));
      if (/\/api\/list$/.test(u.pathname)) return new Response(JSON.stringify(Object.keys(files)));
      if (gate[path]) await gate[path];
      return path in files ? new Response(files[path]) : new Response("not found", {status: 404});
    };
    try { return await body(asked); } finally { window.fetch = real; }
  };

  test("#229 a server area is checked with a ping, not by downloading the vault", async () => {
    await fakeServer({[join(JOURNALS, T() + ".md")]: "- TODO today\n"}, async asked => {
      const b = await spaceBackend({name: "Srv229", kind: "http", server: "http://srv.test"});
      eq(b.kind, "http", "kept the server");
      eq(asked, ["ping"], "asked");
    });
  });

  test("#229 a big vault on a server shows today first, the rest behind", async () => {
    const old = shiftISO(T(), -10);
    let release;
    const held = new Promise(r => { release = r; });
    const files = {[join(JOURNALS, T() + ".md")]: "- TODO today's line\n", [join(JOURNALS, old + ".md")]: "- old line\n",
                   [join(DIRS.active, "Boat.md")]: "title:: Boat\n\n- TODO Sand the hull\n"};
    await fakeServer(files, async () => {
      const rec = newRecord("Srv229b", Backends.http("http://srv.test"));
      try {
        await readInto(rec, {stage: true});
        has(serializePage(rec.pages.get(join(JOURNALS, T() + ".md"))), "today's line", "today read first");
        ok(!rec.pages.has(join(JOURNALS, old + ".md")), "an old day waits");
      } finally { release(); }
      await filesLoaded();
      ok(rec.pages.has(join(JOURNALS, old + ".md")), "old day read");
      has(serializePage(rec.pages.get(join(DIRS.active, "Boat.md"))), "Sand the hull", "project read in full");
    }, {gate: {[join(JOURNALS, old + ".md")]: held}});
  });

  test("#229 a server that never answers gives up instead of holding the start", async () => {
    await fakeServer({}, async () => {
      let err = null;
      try { await fetchWithin("http://srv.test/api/ping", {}, 30); } catch (e) { err = e; }
      ok(err, "a silent server did not fail");
      has(err.message, "no answer", "says why");
    }, {hang: true});
  });

  /* The demo has no IndexedDB (docs/demo.js), so this goes through the
     localStorage backend, which the demo keeps in memory. */
  test("#230 a big area in browser storage shows today first, the rest behind", async () => {
    const old = shiftISO(T(), -10), ns = "Ls230";
    const files = {[join(JOURNALS, T() + ".md")]: "- TODO today's line\n", [join(JOURNALS, old + ".md")]: "- old line\n",
                   [join(DIRS.active, "Boat.md")]: "title:: Boat\n\n- TODO Sand the hull\n"};
    const b = Backends.ls(ns);
    for (const [p, t] of Object.entries(files)) await b.write(p, t);
    try {
      eq((await b.names()).sort(), Object.keys(files).sort(), "names() lists this area's pages only");
      eq([...(await b.readMany([join(DIRS.active, "Boat.md"), "pages/none.md"])).keys()], [join(DIRS.active, "Boat.md")], "readMany() skips what is not there");
      const batches = [], read = b.readMany.bind(b);
      b.readMany = (paths, onEach) => { batches.push(paths.slice()); return read(paths, onEach); };
      const rec = newRecord(ns, b);
      await readInto(rec, {stage: true});
      ok(batches[0].includes(join(JOURNALS, T() + ".md")), "today read first");
      ok(!batches[0].includes(join(JOURNALS, old + ".md")) && !batches[0].includes(join(DIRS.active, "Boat.md")),
         "the first read took more than the day needs: " + batches[0].join(", "));
      await filesLoaded();
      ok(!rec.stubs, "no stand-ins left");
      ok(rec.pages.has(join(JOURNALS, old + ".md")), "old day read");
      has(serializePage(rec.pages.get(join(DIRS.active, "Boat.md"))), "Sand the hull", "project read in full");
    } finally { for (const p of Object.keys(files)) await b.remove(p); }
  });

  test("#232 a line typed in today's journal while the rest loads is kept", async () => {
    const old = shiftISO(T(), -10), ns = "Ls232", today = join(JOURNALS, T() + ".md");
    const files = {[today]: "- first line\n", [join(JOURNALS, old + ".md")]: "- old line\n",
                   [join(DIRS.active, "Boat.md")]: "title:: Boat\n\n- TODO Sand the hull\n"};
    const b = Backends.ls(ns);
    for (const [p, t] of Object.entries(files)) await b.write(p, t);
    try {
      // The first read goes through; the rest waits until the line is on screen.
      let release, calls = 0;
      const held = new Promise(r => { release = r; }), read = b.readMany.bind(b);
      b.readMany = async (paths, onEach) => { if (calls++) await held; return read(paths, onEach); };
      const rec = newRecord(ns, b);
      await readInto(rec, {stage: true});
      ok(rec.stubs, "the rest was already in");
      // The line on screen is bound to this block; it is written back when you leave it.
      const line = rec.pages.get(today).blocks[0];
      release();
      await filesLoaded();
      ok(!rec.stubs, "no stand-ins left");
      ok(rec.pages.get(today).blocks[0] === line, "the read swapped the page under the line");
      line.title = "first line, and more typed while it loaded";
      has(serializePage(rec.pages.get(today)), "more typed while it loaded", "the read swapped the page under the line");
    } finally { for (const p of Object.keys(files)) await b.remove(p); }
  });

  test("#232 the page being typed in is not swapped, even when its file changed", async () => {
    const ns = "Ls232b", today = join(JOURNALS, T() + ".md");
    const b = Backends.ls(ns);
    await b.write(today, "- first line\n");
    const host = el("div", {data: {space: ns, path: today}}, el("div", {contenteditable: "true"}, "typing"));
    document.body.append(host);
    try {
      const rec = newRecord(ns, b);
      await readInto(rec);
      const line = rec.pages.get(today).blocks[0];
      await b.write(today, "- first line\n- added on another device\n");
      host.firstChild.focus();
      await readInto(rec);
      host.firstChild.blur();
      ok(rec.pages.get(today).blocks[0] === line, "the page being typed in was swapped");
    } finally { host.remove(); await b.remove(today); }
  });

  test("#232 today's page made from templates before its file was read takes in the file", async () => {
    /* After a fresh download the folder waits for its permission, and today's
       page is poured from its templates. Read from the folder, the day showed
       only the templates until a line was typed and saved. */
    const ns = "Ls232c", today = join(JOURNALS, T() + ".md");
    const b = Backends.ls(ns);
    await b.write(today, "- written in the folder\n");
    try {
      const rec = newRecord(ns, b);
      rec.pages.set(today, parsePage("- from the template\n"));
      rec.dirty.add(today);                       // as ensureJournal leaves it
      await readInto(rec);
      const text = serializePage(rec.pages.get(today));
      has(text, "written in the folder", "the file's lines are not on the page");
      has(text, "from the template", "the template's lines were dropped");
      ok(rec.dirty.has(today), "the merged page is not saved");
      eq(rec.base.get(today), "- written in the folder\n", "saved against the file it took in");
    } finally { await b.remove(today); }
  });

  test("#232 no day page is made while the area's folder waits for its permission", async () => {
    // The demo's storage has today's file, so what is counted is the page being made.
    await flush();
    const name = V.space, real = ensureJournal, made = [];
    ensureJournal = function (d) { made.push(d); return real.apply(this, arguments); };
    PENDING_GRANT.set(name, {name: "Folder232"});
    try {
      await openSpace(name, null, {draw: false});
      eq(made, [], "a day page was made before the folder was read");
      ok(folderWaiting(name), "not waiting");
      AWAY_OK.add(name);
      ok(!folderWaiting(name), "\"Not now\" still waits");
    } finally {
      ensureJournal = real;
      PENDING_GRANT.delete(name); AWAY_OK.delete(name);
      await filesLoaded();
      render();
    }
  });

  test("#232 a page kept in browser storage is merged into the folder's, not laid over it", async () => {
    const name = "Mir232", today = join(JOURNALS, T() + ".md"), realIdb = Backends.idb;
    Backends.idb = ns => Backends.ls(ns);          // the demo has no IndexedDB
    const m = Backends.idb(name);
    await m.write(today, "updated:: 2999-01-01\n\n- from the template\n");
    try {
      const rec = newRecord(name, {kind: "fs"});
      rec.pages.set(today, parsePage("- written in the folder\n"));
      await mergeMirror(rec);
      const text = serializePage(rec.pages.get(today));
      has(text, "written in the folder", "the folder's day was replaced by the browser copy");
      has(text, "from the template", "the browser copy was dropped");
      ok(rec.dirty.has(today), "the merged page is not saved");
    } finally { await m.remove(today); Backends.idb = realIdb; }
  });

  test("#232 allowed back, the area shows at once and the folder's today takes over when read", async () => {
    await flush();
    const name = V.space, kept = LOADED.get(name), ns = "Ls232d";
    const today = journalPath(todayISO()), old = join(JOURNALS, shiftISO(T(), -10) + ".md");
    const b = Backends.ls(ns);
    b.kind = "fs";
    const files = {[today]: "- written in the folder\n", [old]: "- old line\n",
                   [join(DIRS.active, "Boat.md")]: "title:: Boat\n\n- TODO Sand the hull\n"};
    for (const [p, t] of Object.entries(files)) await b.write(p, t);
    // A phone listing a big folder: nothing comes back until it is let go.
    let listed, release, calls = 0;
    const listing = new Promise(r => { listed = r; }), held = new Promise(r => { release = r; });
    const names = b.names.bind(b), read = b.readMany.bind(b);
    b.names = async () => { await listing; return names(); };
    b.readMany = async (paths, onEach) => { if (calls++) await held; return read(paths, onEach); };
    const copy = newRecord(name, Backends.memory("Old232"));
    LOADED.set(name, copy); bindActive(name);
    try {
      const back = await Promise.race([loadFromBackend(b, {quick: true}).then(() => "back"),
                                       new Promise(r => setTimeout(() => r("waiting"), 1500))]);
      eq(back, "back", "the screen waited for the folder (Opening area... #232)");
      ok(V.pages === copy.pages, "the browser copy is not on screen while the folder is read");
      ok(folderWaiting(name), "a day page could be made from the browser copy meanwhile");
      listed();
      for (let i = 0; i < 100 && LOADED.get(name) === copy; i++) await new Promise(r => setTimeout(r, 20));
      ok(LOADED.get(name) !== copy, "the folder never took over");
      has(serializePage(V.pages.get(today)), "written in the folder", "today is not the folder's");
      ok(LOADED.get(name).stubs, "the whole folder was read before today showed");
      ok(!folderWaiting(name), "still waiting after the folder was read");
    } finally {
      listed(); release();
      await filesLoaded();
      FOLDER_READING.delete(name);
      LOADED.set(name, kept); bindActive(name);
      for (const p of Object.keys(files)) await b.remove(p);
      render();
    }
  });

  test("#232 while the folder is read behind, the status says so, not browser only", async () => {
    await flush();
    const name = V.space, kept = LOADED.get(name);
    const b = Backends.memory("Rd232");
    b.kind = "fs"; b.handle = {name: "Folder232"};
    let listed, fail;
    const listing = new Promise((r, no) => { listed = r; fail = no; });
    b.names = async () => { await listing; return []; };
    const copy = newRecord(name, Backends.memory("Old232e"));
    LOADED.set(name, copy); bindActive(name);
    try {
      await loadFromBackend(b, {quick: true});
      setSync("ok", V.backend.label);                 // what every save does when it is done
      eq($("#syncTxt").textContent, "reading the folder...", "the status said browser only while the folder was read");
      fail(Object.assign(new Error("gone"), {name: "NotReadableError"}));
      for (let i = 0; i < 50 && FOLDER_READING.has(name); i++) await new Promise(r => setTimeout(r, 20));
      ok(PENDING_GRANT.has(name), "a folder that could not be read is not asked for again");
      setSync("ok", V.backend.label);
      eq($("#syncTxt").textContent, "folder not connected", "a folder that could not be read reads as browser only");
    } finally {
      listed(); await filesLoaded();
      FOLDER_READING.delete(name); PENDING_GRANT.delete(name);
      LOADED.set(name, kept); bindActive(name);
      setSync("ok", V.backend.label); render();
    }
  });

  test("#232 a file that never answers is left unread, and does not hold the folder", async () => {
    const was = FILE_READ_MS;
    FILE_READ_MS = 50;
    const dir = {kind: "directory", name: "t232",
      async *entries() {
        yield ["fine.md", {kind: "file", name: "fine.md", getFile: async () => ({text: async () => "- fine\n"})}];
        yield ["stuck.md", {kind: "file", name: "stuck.md", getFile: () => new Promise(() => {})}];
      }};
    try {
      const b = Backends.fs(dir);
      const got = await b.readMany(await b.names());
      eq(got.get("fine.md"), "- fine\n");
      ok(!got.has("stuck.md"), "a file that never answered was read");
      has(b.unread.get("stuck.md") || "", "TimeoutError", "the stuck file is not marked unread");
    } finally { FILE_READ_MS = was; }
  });

  test("#231 start-up draws the first screen once, not twice", async () => {
    const real = render;
    const drawn = [];
    render = function () { drawn.push(new Error().stack.split("\n").slice(2, 5).join(" < ")); return real.apply(this, arguments); };
    // As at start-up: nothing read in yet. (An area already in memory is read
    // again behind your back, and that read draws when it is done, rightly.)
    await flush();
    const name = V.space, kept = LOADED.get(name);
    LOADED.delete(name);
    try { await openSpace(name, null, {draw: false}); }
    catch (e) { LOADED.set(name, kept); throw e; }
    finally { render = real; }
    ok(V.pages.size > 50, "the area read back in");
    /* The rest of a big folder draws when it is in (restLoaded, soonLoaded),
       rightly, and on a fast store that can land before openSpace returns. */
    eq(drawn.filter(d => !/restLoaded|soonLoaded/.test(d)), [], "openSpace with draw: false drew");
    const init = [...document.scripts].map(x => x.textContent).find(t => t.includes("(async function init()")) || "";
    has(init, "await openSpace(start, null, {draw: false})", "init leaves the drawing to itself");
    render();
  });

  test("#181 a stand-in edited while it loads gives way to its file when the first of the rest is in", () => {
    const rec = newRecord("Lay181", null);
    const path = personPath("Tor Vik");
    rec.stubs = new Set([path]);
    rec.pages.set(path, parsePage(""));
    rec.dirty.add(path);
    const mine = join(JOURNALS, shiftISO(T(), -5) + ".md");
    rec.pages.set(mine, parsePage("- typed here meanwhile\n"));
    rec.dirty.add(mine);
    layInSoon(rec, new Map([[path, "title:: Tor Vik\n\n- met at the fair\n"], [mine, "- the file\n"]]), new Set());
    has(serializePage(rec.pages.get(path)), "met at the fair", "the file");
    ok(!rec.stubs.has(path) && !rec.dirty.has(path), "still a stand-in, or still to be sent");
    has(serializePage(rec.pages.get(mine)), "typed here meanwhile", "a page made meanwhile");
  });
  test("#181 the bar under Pages shows how far, and a click lists each file", async () => {
    const rec = {name: "Bar181"};
    const tick = loadingTicker(rec, 4);
    try {
      tick("pages/p/Tor Vik.md");
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
      has(list.textContent, "p/Tor Vik", "the file read");
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
    const tree = {pages: {p: {"Tor Vik.md": "title:: Tor Vik\n", "Bad.md": "x"}}};
    const b = Backends.fs(fakeDir("R188", tree, [], {"Bad.md": refused}));
    const files = await b.readMany(await b.names());
    ok(files.has("pages/p/Tor Vik.md"), "the good file was lost with the bad one");
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
      pages: {"GTD.md": "title:: GTD\n", p: {"Tor Vik.md": "title:: Tor Vik\n"}, o: {"Harbour Bakery.md": "title:: Harbour Bakery\n"}}};
    const names = await Backends.fs(shy("Shy188", tree)).names();
    eq(names.slice().sort(), ["journals/" + T() + ".md", "pages/GTD.md", "pages/o/Harbour Bakery.md", "pages/p/Tor Vik.md"]);
  });
  test("#188 a file that fails while sixteen are read together gets one more try", async () => {
    let tries = 0;
    const flaky = Promise.reject(new DOMException("busy", "NotReadableError"));
    flaky.catch(() => {});
    const tree = {pages: {p: {"Tor Vik.md": "title:: Tor Vik\n"}}};
    const gate = {get "Tor Vik.md"() { return tries++ ? undefined : flaky; }};
    const b = Backends.fs(fakeDir("Retry188", tree, [], gate));
    const files = await b.readMany(await b.names());
    ok(files.has("pages/p/Tor Vik.md"), "not read on the second try");
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
    const tree = {pages: {p: {"Tor Vik.md": "title:: Tor Vik\nphone:: 12345678\n\n- met at the fair\n"}}};
    const writes = [];
    const rec = newRecord("Link188", Backends.fs(fakeDir("Link188", tree, writes)));
    LOADED.set(rec.name, rec);
    try {
      inSpace(rec.name, () => openLinkTarget("p/Tor Vik"));
      for (let i = 0; i < 20 && !rec.pages.has(personPath("Tor Vik")); i++) await settle();
      const page = rec.pages.get(personPath("Tor Vik"));
      ok(page, "the page was not opened");
      has(serializePage(page), "met at the fair", "the file's own lines");
      ok(!rec.dirty.has(personPath("Tor Vik")), "the page read is queued to be written back");
      has(tree.pages.p["Tor Vik.md"], "12345678", "the file was written over");
    } finally { LOADED.delete(rec.name); }
  });
  test("#188 Check the folder names a linked page the folder has but did not list", async () => {
    const tree = {pages: {"GTD.md": "title:: GTD\n", p: {}}, journals: {[T() + ".md"]: "- TODO call [[p/Tor Vik]]\n"}};
    const rec = newRecord("Check188", Backends.fs(fakeDir("Check188", tree, [])));
    await readInto(rec);
    // In the folder by name, but the listing leaves it out.
    tree.pages.p["Tor Vik.md"] = "title:: Tor Vik\n";
    const hide = rec.backend.names.bind(rec.backend);
    rec.backend.names = async () => (await hide()).filter(n => !n.includes("Tor Vik"));
    LOADED.set(rec.name, rec);
    try {
      const r = await folderCheckReport(rec.name);
      eq(r.unlisted, [personPath("Tor Vik")], "linked and in the folder, not listed");
      eq(r.notIn, [], "listed but not in the app");
    } finally { LOADED.delete(rec.name); }
  });

  test("#188 the template pass leaves a page still being read alone", async () => {
    let release;
    const old = shiftISO(T(), -10);
    const tree = {journals: {[T() + ".md"]: "- today\n", [old + ".md"]: "- old\n"},
      pages: {"GTD.md": "title:: GTD\n", "8": {"p.md": "title:: %title%\ntype:: person\nphone:: \n"},
        p: {"Tor Vik.md": "title:: Tor Vik\nupdated:: 2026-01-01T00:00:00Z\n\n- met at the fair\n"}}};
    const held = new Promise(r => { release = r; });
    const rec = newRecord("Tpl188", Backends.fs(fakeDir("Tpl188", tree, [], {[old + ".md"]: held, "Tor Vik.md": held})));
    await readInto(rec, {stage: true});
    const path = personPath("Tor Vik");
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
    const tree = {pages: {"GTD.md": "title:: GTD\n", p: {"Tor Vik.md": "title:: Tor Vik\n\n- met at the fair\n"}}};
    const writes = [];
    const rec = newRecord("Unread188", Backends.fs(fakeDir("Unread188", tree, writes, {"Tor Vik.md": refused})));
    await readInto(rec);
    const path = personPath("Tor Vik");
    ok(rec.backend.unread.has(path), "not noted as would not open");
    rec.pages.set(path, pageTemplateFor("p", "Tor Vik"));
    rec.dirty.add(path);
    LOADED.set(rec.name, rec);
    try { await doFlush(); } finally { LOADED.delete(rec.name); }
    ok(!writes.includes("Tor Vik.md"), "a blank page went over the file");
    has(tree.pages.p["Tor Vik.md"], "met at the fair", "the file");
  });

  /* #220: a sync app (Syncthing) changes a file behind the app's back. The
     page is saved merged with it, against the file as this device read it. */
  const synced = async (name, file, text) => {
    const tree = {pages: {"GTD.md": "title:: GTD\n", "1": {[file]: text}}};
    const writes = [];
    const rec = newRecord(name, Backends.fs(fakeDir(name, tree, writes)));
    await readInto(rec);
    const path = join(DIRS.active, file);
    const save = async () => {
      rec.dirty.add(path);
      LOADED.set(rec.name, rec);
      try { await doFlush(); } finally { LOADED.delete(rec.name); }
    };
    return {tree, writes, rec, path, save, page: () => rec.pages.get(path),
            disk: () => tree.pages["1"][file], setDisk: t => { tree.pages["1"][file] = t; }};
  };
  const BOAT = "title:: Boat\nupdated:: 2026-10-01T00:00:00Z\n\n- TODO Sand the hull\n- TODO Paint the hull\n- TODO Buy rope\n";
  test("#220 a page another device changed is merged before it is saved, not written over", async () => {
    const s = await synced("Sync220a", "Boat.md", BOAT);
    // The other device adds a line and ticks one off.
    s.setDisk(BOAT.replace("TODO Sand", "DONE Sand") + "- TODO Fit the mast\n");
    // This device, still holding the old copy, changes another line.
    s.page().blocks[2].title = "Buy 20 m rope";
    const said = [];
    const was = window.notify;
    window.notify = (m, l) => { said.push([m, l]); };
    try { await s.save(); } finally { window.notify = was; }
    ok(said.some(([m, l]) => /Boat/.test(m) && l !== "warn"), "not told calmly: " + JSON.stringify(said));
    const d = s.disk();
    has(d, "DONE Sand the hull", "their tick");
    has(d, "Fit the mast", "their new line");
    has(d, "TODO Buy 20 m rope", "our change");
    ok(!/Buy rope/.test(d), "our old line came back");
    eq(serializePage(s.page()), d, "the page here is the merged one");
  });
  test("#220 a line taken out on either device stays out", async () => {
    const s = await synced("Sync220b", "Boat.md", BOAT);
    s.setDisk(BOAT.replace("- TODO Paint the hull\n", ""));
    s.page().blocks.splice(2, 1);          // Buy rope, here
    await s.save();
    eq(s.page().blocks.map(b => b.title), ["Sand the hull"], "both deletes stand");
  });
  test("#220 a line both devices changed keeps both versions, and says so", async () => {
    const s = await synced("Sync220c", "Boat.md", BOAT);
    s.setDisk(BOAT.replace("Paint the hull", "Paint the hull blue"));
    s.page().blocks[1].title = "Paint the hull red";
    const said = [];
    const was = window.notify;
    window.notify = (m, l) => { said.push([m, l]); };
    try { await s.save(); } finally { window.notify = was; }
    const d = s.disk();
    has(d, "Paint the hull red", "ours");
    has(d, "Paint the hull blue", "theirs");
    ok(said.some(([m, l]) => l === "warn" && /both versions/.test(m) && /Boat/.test(m)), "not told: " + JSON.stringify(said));
  });
  test("#220 the page's fields merge one by one, the newer edit winning a clash", async () => {
    const s = await synced("Sync220d", "Boat.md", "title:: Boat\noutcome:: afloat\nupdated:: 2026-10-01T00:00:00Z\n\n- TODO Sand the hull\n");
    s.setDisk("title:: Boat\noutcome:: afloat by May\nupdated:: 2026-10-02T00:00:00Z\nowner:: Kari\n\n- TODO Sand the hull\n");
    s.page().props.updated = "2026-10-03T00:00:00Z";
    s.page().props.review = "weekly";
    await s.save();
    const p = s.page().props;
    eq([p.outcome, p.owner, p.review, p.updated], ["afloat by May", "Kari", "weekly", "2026-10-03T00:00:00Z"]);
  });
  test("#220 a file nobody else touched is written as it is, with no merge", async () => {
    const s = await synced("Sync220e", "Boat.md", BOAT);
    s.page().blocks.splice(0, 1);
    await s.save();
    eq(s.disk(), serializePage(s.page()));
    ok(!/Sand/.test(s.disk()), "the line taken out came back");
    // And the next save is measured against what was written.
    s.page().blocks.splice(0, 1);
    await s.save();
    ok(!/Paint/.test(s.disk()), "the second delete came back");
  });
  test("#220 a page made on both devices keeps the lines of both", async () => {
    const s = await synced("Sync220f", "Boat.md", BOAT);
    const path = join(DIRS.active, "Kayak.md");
    s.rec.pages.set(path, parsePage("title:: Kayak\n\n- TODO Find a paddle\n"));
    s.tree.pages["1"]["Kayak.md"] = "title:: Kayak\n\n- TODO Book the trip\n";
    s.rec.dirty.add(path);
    LOADED.set(s.rec.name, s.rec);
    try { await doFlush(); } finally { LOADED.delete(s.rec.name); }
    const d = s.tree.pages["1"]["Kayak.md"];
    has(d, "Find a paddle"); has(d, "Book the trip");
  });
  test("#220 while you type, the merge waits rather than swap the page under the line", async () => {
    const s = await synced("Sync220g", "Boat.md", BOAT);
    s.setDisk(BOAT + "- TODO Fit the mast\n");
    s.page().blocks[2].title = "Buy 20 m rope";
    const typing = el("div", {contenteditable: "true"});
    document.body.append(typing);
    typing.focus();
    const page = s.page();
    try {
      await s.save();
      ok(s.page() === page, "the page was swapped while typing");
      ok(s.rec.dirty.has(s.path), "no longer waiting to be saved");
      ok(!/20 m/.test(s.disk()), "written over the other device's file");
    } finally { typing.remove(); }
    await s.save();
    has(s.disk(), "Fit the mast"); has(s.disk(), "Buy 20 m rope");
    ok(!s.rec.dirty.has(s.path), "still waiting after the typing stopped");
  });
  test("#220 a page edited while the folder is read again is merged against the file it was edited from", async () => {
    const s = await synced("Sync220h", "Boat.md", BOAT);
    s.page().blocks[2].title = "Buy 20 m rope";
    s.rec.dirty.add(s.path);
    s.setDisk(BOAT + "- TODO Fit the mast\n");
    await readInto(s.rec);                // Check the folder, or switching back to the area
    await s.save();
    has(s.disk(), "Fit the mast", "their line");
    has(s.disk(), "Buy 20 m rope", "our edit");
  });
  /* #233: the installed app and a tab share one browser storage (localStorage
     here, as the demo has no IndexedDB; both take the same path). The window
     left open with an old copy must not put it over the other's save. */
  const twoWindows = async (name, file, text) => {
    const back = Backends.ls(name);
    const path = join(DIRS.active, file);
    for (const p of await back.names()) await back.remove(p);
    await back.write("pages/GTD.md", "title:: GTD\n");
    await back.write(path, text);
    const rec = newRecord(name, Backends.ls(name));
    await readInto(rec);
    await filesLoaded();
    const save = async () => {
      rec.dirty.add(path);
      LOADED.set(rec.name, rec);
      try { await doFlush(); } finally { LOADED.delete(rec.name); }
    };
    const stored = () => back.readText(path);
    const clean = async () => { for (const p of await back.names()) await back.remove(p); };
    return {back, rec, path, save, stored, clean, page: () => rec.pages.get(path)};
  };
  test("#233 a page the other window saved to browser storage is merged, not written over", async () => {
    const w = await twoWindows("Win233a", "Boat.md", BOAT);
    try {
      // The other window (the installed app) adds a line and saves.
      await w.back.write(w.path, BOAT + "- TODO Fit the mast\n");
      // This window, still holding the old copy, changes another line.
      w.page().blocks[2].title = "Buy 20 m rope";
      const was = window.notify;
      window.notify = () => {};
      try { await w.save(); } finally { window.notify = was; }
      const d = await w.stored();
      has(d, "Fit the mast", "the other window's line");
      has(d, "Buy 20 m rope", "this window's change");
      ok(!/Buy rope\n/.test(d), "the old line came back");
    } finally { await w.clean(); }
  });
  test("#233 a page saved in another window is read in here, unless it has unsaved work", async () => {
    const w = await twoWindows("Win233b", "Boat.md", BOAT);
    const kayak = join(DIRS.active, "Kayak.md");
    try {
      await w.back.write(w.path, BOAT + "- TODO Fit the mast\n");
      await w.back.write(kayak, "title:: Kayak\n\n- TODO Find a paddle\n");
      eq(await takeSiblingSaves(w.rec, [w.path, kayak]), 2, "pages read in");
      has(serializePage(w.page()), "Fit the mast");
      has(serializePage(w.rec.pages.get(kayak)), "Find a paddle");
      // Unsaved work here stays as it is; it goes up merged.
      w.page().blocks[0].title = "Sand the hull twice";
      w.rec.dirty.add(w.path);
      await w.back.write(w.path, BOAT + "- TODO Fit the mast\n- TODO Varnish\n");
      await takeSiblingSaves(w.rec, [w.path]);
      has(serializePage(w.page()), "Sand the hull twice", "unsaved work replaced");
      // A page the other window deleted goes here too.
      await w.back.remove(kayak);
      await takeSiblingSaves(w.rec, null);
      ok(!w.rec.pages.has(kayak), "deleted page still here");
    } finally { await w.clean(); }
  });
  test("#221 a line both devices changed, ticked on one, comes out once and done", async () => {
    const s = await synced("Sync221a", "Boat.md", BOAT);
    s.setDisk(BOAT.replace("- TODO Buy rope\n", "- TODO Buy rope\n  shop:: chandler\n"));
    s.page().blocks[2].state = "DONE";
    await s.save();
    const rope = s.page().blocks.filter(b => b.title === "Buy rope");
    eq(rope.length, 1, "Buy rope lines");
    eq([rope[0].state, blockProp(rope[0], "shop")], ["DONE", "chandler"]);
  });

  /* #221: Syncthing keeps the losing version beside the page as a conflict copy. */
  const COPY = "Boat.sync-conflict-20261031-101500-ABCDEFG.md";
  const withCopy = async (name, page, copy, more = {}) => {
    const tree = {pages: {"GTD.md": "title:: GTD\n", "1": Object.assign(page == null ? {} : {"Boat.md": page}, {[COPY]: copy}, more)}};
    const writes = [];
    const rec = newRecord(name, Backends.fs(fakeDir(name, tree, writes)));
    const said = [];
    const was = window.notify;
    window.notify = m => { said.push(m); };
    try { await readInto(rec); } finally { window.notify = was; }
    const path = join(DIRS.active, "Boat.md");
    const save = async () => {
      LOADED.set(rec.name, rec);
      try { await doFlush(); } finally { LOADED.delete(rec.name); }
    };
    return {tree, rec, path, said, save, page: () => rec.pages.get(path), folder: () => tree.pages["1"]};
  };
  test("#221 a Syncthing conflict copy is merged into its page and deleted, not shown as a page", async () => {
    const s = await withCopy("Copy221a", BOAT, BOAT.replace("updated:: 2026-10-01T00:00:00Z", "updated:: 2026-10-02T00:00:00Z") + "- TODO Fit the mast\n");
    ok(![...s.rec.pages.keys()].some(p => /sync-conflict/.test(p)), "the copy is a page");
    eq(s.page().blocks.map(b => b.title), ["Sand the hull", "Paint the hull", "Buy rope", "Fit the mast"]);
    ok(s.said.some(m => /conflict copy of .Boat./.test(m)), "not told: " + JSON.stringify(s.said));
    await s.save();
    ok(!(COPY in s.folder()), "the copy is still in the folder");
    has(s.folder()["Boat.md"], "Fit the mast", "the page in the folder");
    eq(s.page().props.updated, "2026-10-02T00:00:00Z", "the copy edited last leads");
  });
  test("#221 the same line in a page and its copy comes out once, done if either ticked it", async () => {
    const s = await withCopy("Copy221b",
      BOAT.replace("TODO Sand", "DONE Sand") + "- TODO Varnish the deck\n",
      BOAT.replace("TODO Paint the hull", "TODO Paint the hull\n  colour:: blue") + "- TODO Fit the mast\n- TODO  sand   the HULL\n");
    const titles = s.page().blocks.map(b => b.state + " " + b.title);
    // A line only in the copy goes in after the line it followed there.
    eq(titles, ["DONE Sand the hull", "TODO Paint the hull", "TODO Buy rope", "TODO Fit the mast", "TODO Varnish the deck"]);
    eq(blockProp(s.page().blocks[1], "colour"), "blue", "a field from the copy");
  });
  test("#221 lines a page has twice on purpose stay twice", async () => {
    const page = "title:: Boat\n\n- Check\n- Check\n- TODO Buy rope\n";
    const s = await withCopy("Copy221c", page, page + "- TODO Fit the mast\n");
    eq(s.page().blocks.map(b => b.title), ["Check", "Check", "Buy rope", "Fit the mast"]);
  });
  test("#221 a conflict copy whose page is gone becomes the page", async () => {
    const s = await withCopy("Copy221d", null, BOAT);
    eq(s.page().blocks.length, 3, "the copy's lines");
    await s.save();
    ok(!(COPY in s.folder()), "the copy is still in the folder");
    has(s.folder()["Boat.md"], "Sand the hull");
  });
  test("#221 Check the folder does not list a conflict copy as missing from the app", async () => {
    const s = await withCopy("Copy221e", BOAT, BOAT);
    LOADED.set(s.rec.name, s.rec);
    try { eq((await folderCheckReport(s.rec.name)).notIn, []); } finally { LOADED.delete(s.rec.name); }
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
  /* A chore's next round goes on a journal page (#212), so a chore test puts
     the journal back as it found it when it drops its chores. */
  let journalsBefore = null;
  const journalSnap = () => new Map(allPages(isJournalPath).map(p => [p, serializePage(getPage(p))]));
  const journalRestore = () => {
    if (!journalsBefore) return;
    for (const p of allPages(isJournalPath)) {
      const was = journalsBefore.get(p);
      if (was == null) V.pages.delete(p);
      else if (serializePage(getPage(p)) !== was) putPage(p, parsePage(was), {silent: true});
    }
    journalsBefore = null;
    clearMemo();
  };
  const choreProject = (title, blocks) => {
    journalsBefore = journalsBefore || journalSnap();
    const path = scratchProject(title);
    getPage(path).blocks = blocks;
    touch(path); clearMemo();
    return path;
  };
  const dropChores = path => { getPage(path).blocks = []; touch(path); clearMemo(); journalRestore(); };
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
      eq(getPage(path).blocks.map(x => x.state), ["DONE"], "the room page keeps only the done one (#212)");
      const next = allChores().find(a => a.block !== b && choreKey(a.title) === choreKey(b.title));
      ok(next, "the next one is in");
      eq(next.path, journalPath(weekOf(shiftISO(T(), 7))), "on next week's page");
      eq(dueDate(next.block), shiftISO(T(), 7), "next one a week on");
      if (turn) ok(samePerson(assigneeOf(next.block) || whoAmI(), turn), "for " + turn);
      const undo = [...document.querySelectorAll("#toasts button")].find(n => n.textContent === "Undo");
      ok(undo, "the done toast has Undo");
      undo.click(); await settle();
      eq(getPage(path).blocks.map(x => x.state), ["TODO"]);
      ok(!findBlock(next.block.id), "and the next one is gone");
    } finally { closeDoneToast(); closeModal(); dropChores(path); }
  });
  test("#212 a chore's next round goes on the day or week page it is due, saying its room", async () => {
    const day = shiftISO(T(), 1), wk = weekOf(shiftISO(T(), 14));
    const dayPage = journalPath(day), weekPage = journalPath(wk);
    const path = choreProject("chores journal", [
      newBlock({title: "[[c/home/kitchen]]", children: [chore("Empty the dishwasher", "daily", 0)]}),
      chore("Vacuum the hall [[c/home/hall]]", "every 2 weeks", 0)]);
    try {
      eq([choreRepeatOnWeek("weekly"), choreRepeatOnWeek("every 2 weeks"), choreRepeatOnWeek("monthly"),
        choreRepeatOnWeek("daily"), choreRepeatOnWeek("every monday"), choreRepeatOnWeek("weekly on mon, thu"),
        choreRepeatOnWeek("monthly on the 15th")], [true, true, true, false, false, false, false]);
      const page = getPage(path), [head, hall] = page.blocks, dish = head.children[0];
      flattenBlocks(page.blocks);
      setBlockState(path, dish, "DONE", {nextNow: true}); await settle();
      setBlockState(path, hall, "DONE", {nextNow: true}); await settle();
      eq(head.children.length, 1, "nothing new under the room heading");
      eq(page.blocks.length, 2, "nothing new on the room page");
      const onDay = getPage(dayPage).blocks.find(b => b.state === "TODO" && /Empty the dishwasher/.test(b.title));
      ok(onDay, "daily goes on tomorrow's page");
      has(onDay.title, "[[c/home/kitchen]]", "it says its room");
      eq(dueDate(onDay), day);
      const onWeek = getPage(weekPage).blocks.find(b => b.state === "TODO" && /Vacuum the hall/.test(b.title));
      ok(onWeek, "every 2 weeks goes on the week page " + wk);
      clearMemo();
      ok(allChores().some(a => a.block === onDay && a.context === "home/kitchen"), "Chores finds it in its room");
      ok(whoseTurn(onDay) === null || typeof whoseTurn(onDay) === "string", "whose turn still reads");
      getPage(weekPage).blocks.push(chore("Wipe the fridge [[c/home/kitchen]]", "weekly", 14));
      ensureWeek(shiftWeek(wk, 1));
      ok(!getPage(journalPath(shiftWeek(wk, 1))).blocks.some(b => /Wipe the fridge/.test(b.title)),
        "a new week page does not copy the chore again");
    } finally { closeDoneToast(); closeModal(); dropChores(path); }
  });
  test("#80 the done toast sits at the top edge, one item's Backdate and Undo beside History", async () => {
    closeDoneToast();
    const mk = n => ({kind: "todo", label: "toast item " + n, day: T(), at: Date.now() + n, undo: () => {}});
    try {
      offerDone(mk(1)); await settle();
      const head = document.querySelector("#toasts .toast.done .donehead");
      ok(head, "the done toast has a top row");
      const btns = () => [...head.querySelectorAll("button")].map(b => b.textContent);
      ok(["Backdate", "Undo", "History"].every(x => btns().includes(x)), "Backdate, Undo and History share the top row: " + btns());
      ok(parseFloat(getComputedStyle($("#toasts")).top) < 20, "at the very top");
      offerDone(mk(2)); await settle();
      ok(!btns().includes("Undo"), "with two, each Undo goes back beside its own name");
      eq(document.querySelectorAll("#toasts .toast.done button").length - head.querySelectorAll("button").length >= 4, true);
      [...document.querySelectorAll("#toasts .toast.done button")].filter(b => b.textContent === "Undo")[1].click(); await settle();
      ok(btns().includes("Undo"), "back to one: its Undo is up top again");
    } finally {
      closeDoneToast();
      PREF.set("done.history", JSON.stringify(doneHistory().filter(x => !/^toast item /.test(x.label))));
    }
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
      eq(row && row[1], {pts: 3, n: 2, logged: 0});
      const last = choreTally(shiftISO(weekStartISO(T()), -7), shiftISO(weekStartISO(T()), -1)).find(([n]) => n === "Test Pointsperson");
      eq(last && last[1], {pts: 4, n: 1, logged: 0});
    } finally { dropChores(path); }
  });
  /* Household people (#236): at home, not in the app. */
  const householder = name => {
    const path = personPath(name);
    putPage(path, {props: {title: name, household: "true"}, blocks: []});
    clearMemo();
    return path;
  };
  test("#239 an as-needed chore is no task: never late or on Next, and Did it logs a done line that counts", async () => {
    const path = choreProject("chores as needed", [newBlock({title: "Laundry #30m [[c/home/laundry]]", props: {repeat: "as needed"}})]);
    const b = getPage(path).blocks[0];
    const logged = () => (getPage(journalPath(T()))?.blocks || []).filter(x => isLoggedChore(x) && /^Laundry/.test(x.title));
    try {
      eq(nextRepeatDate("as needed", T()), null, "it has no next round");
      ok(asNeededChores().some(a => a.block === b), "an as-needed chore");
      ok(!allChores().some(a => a.block === b), "not a scheduled chore, so no bar and never late");
      ok(!nextActions().some(a => a.block === b), "not on Next");
      ok(NAV_ITEMS.find(it => it && it.id === "chores").when(), "Chores is in the sidebar");
      go("chores"); await settle();
      const row = () => [...content().querySelectorAll(".asneeded .asneeded-row")].find(r => r.textContent.includes("Laundry"));
      ok(row(), "in the As needed fold");
      ok(/not done yet/.test(row().textContent), row().textContent);
      eq(logged().length, 0);
      row().querySelector(".didit").click(); await settle();
      const done = logged()[0];
      ok(done, "Did it writes a done line on today's page");
      eq([blockContext(done), estTier(done.title), closedBy(done), closedOn(done)], ["home/laundry", 2, "Kenneth Aar", T()]);
      ok(!b.state && isAsNeeded(repeatOf(b)), "the chore itself stays, for next time");
      ok(/today/.test(row().textContent), "last done today: " + row().textContent);
      const mine = choreTally(T(), T()).find(([n]) => n === "Kenneth Aar");
      ok(mine && mine[1].logged >= 1, "Points counts it as logged");
      ok(/logged/.test(content().querySelector(".choreboard").textContent), "the board says how many were logged");
      undoLast(); await settle();
      eq(logged().length, 0, "Undo takes it back");
    } finally { dropChores(path); }
  });
  test("#239 Log a chore writes a done line on the day's page for who did it, in a new room", async () => {
    const leo = householder("Leo Testlog");
    const path = choreProject("chores log", []);
    // Written as @home is written in this vault: Home/Testlogroom here.
    const ctx = ctxSlug("home/testlogroom"), room = contextPath(ctx), had = !!getPage(room);
    const day = shiftISO(T(), -1);
    try {
      openLogChore(""); await settle();
      const m = document.querySelector(".scrim .modal");
      const set = (sel, v) => { const n = m.querySelector(sel); n.value = v; n.dispatchEvent(new Event("change")); n.dispatchEvent(new Event("input")); };
      set('input[aria-label="What"]', "Change the bed");
      set('select[aria-label="Room"]', "\u0002");
      set('input[aria-label="New room"]', "testlogroom");
      set('input[aria-label="Duration"]', "30m");
      set('select[aria-label="Who did it"]', "Leo Testlog");
      set('select[aria-label="When"]', "yesterday");
      eq(m.querySelector(".logchore-line").textContent, "DONE Change the bed #30m [[c/" + ctx + "]]  done_by:: Leo Testlog");
      [...m.querySelectorAll("button")].find(n => n.textContent === "Log it").click(); await settle();
      const done = getPage(journalPath(day)).blocks.find(x => isLoggedChore(x) && /^Change the bed/.test(x.title));
      ok(done, "a done line on yesterday's page");
      eq([blockContext(done), closedBy(done), closedOn(done)], [ctx, "Leo Testlog", day]);
      ok(getPage(room), "the new room has its page");
      eq(choreTally(day, day).find(([n]) => n === "Leo Testlog")?.[1], {pts: 2, n: 1, logged: 1});
      ok(choreRecent().some(r => r.words === "Change the bed" && r.ctx === ctx && r.size === "30m"), "offered next time, with its room and size");
    } finally { closeModal(); dropChores(path); if (!had) removePage(room); removePage(leo); clearMemo(); }
  });
  test("#236 a household person takes turns, keeps a chore handed to them a task, and gets the points", async () => {
    const mia = householder("Mia Testhome"), leo = householder("Leo Testhome");
    const path = choreProject("chores household", [chore("Empty the dishwasher #15m [[c/home/kitchen]]", "daily", 0)]);
    try {
      ok(isHousehold("Mia Testhome") && !isMember("Mia Testhome"), "household:: true makes a household person");
      ok(choreCrew().some(m => m.name === "Leo Testhome"), "they take turns");
      eq(assignKind("Mia Testhome"), "household");
      const b = getPage(path).blocks[0];
      assignBlock(path, b, "Mia Testhome", true); clearMemo();
      eq(b.state, "TODO", "handed to the household it stays a task");
      ok(!waitingRows().some(a => a.block === b), "not in Waiting for");
      go("chores"); await settle();
      setBlockState(path, b, "DONE", {nextNow: true}); await settle();
      eq(closedBy(b), "Mia Testhome", "ticked by me, credited to Mia");
      const next = findBlock(allChores().find(a => a.block !== b && /Empty the dishwasher/.test(a.title))?.block?.id || "")?.block;
      ok(next && next.state === "TODO", "the next one is in");
      ok(!samePerson(assigneeOf(next) || whoAmI(), "Mia Testhome"), "and it is not Mia's turn again: " + assigneeOf(next));
      const pick = document.querySelector("#toasts .donecredit");
      ok(pick, "the done toast asks who did it");
      eq(pick.value, "Mia Testhome", "Mia to start with");
      pick.value = "Leo Testhome"; pick.dispatchEvent(new Event("change")); await settle();
      eq(closedBy(b), "Leo Testhome", "By Leo moves the credit");
      ok(!samePerson(assigneeOf(next) || whoAmI(), "Leo Testhome"), "and the next turn is worked out again");
      const row = choreTally(T(), T()).find(([n]) => n === "Leo Testhome");
      eq(row && row[1], {pts: 1, n: 1, logged: 0}, "the point is Leo's");
    } finally { closeDoneToast(); dropChores(path); removePage(mia); removePage(leo); clearMemo(); }
  });
  test("#236 Chores shows one person's chores, and a person page marks them Household", async () => {
    const mia = householder("Mia Testhome");
    const path = choreProject("chores filter", [chore("Feed the cat [[c/home]]", "daily", 0, {assigned: "Mia Testhome"}),
      chore("Water the ferns [[c/home]]", "daily", 0)]);
    const was = PREF.get("chores.who", "");
    try {
      go("chores"); await settle();
      const chip = name => [...content().querySelectorAll(".chorewho .fchip")].find(n => n.firstChild.textContent === name);
      ok(chip("Mia"), "a chip for Mia");
      chip("Mia").click(); await settle();
      ok(content().textContent.includes("Feed the cat") && !content().textContent.includes("Water the ferns"), "only Mia's");
      chip("Everyone").click(); await settle();
      ok(content().textContent.includes("Water the ferns"), "everyone's again");
      setHousehold(mia, false);
      ok(!isHousehold("Mia Testhome"), "off again");
      openPersonPage("Mia Testhome"); await settle();
      const btn = content().querySelector(".householdbtn");
      ok(btn && btn.getAttribute("aria-pressed") === "false", "the person page has a Household toggle");
      btn.click(); await settle();
      eq(getPage(mia).props.household, "true", "it writes household:: true");
    } finally { PREF.set("chores.who", was); dropChores(path); removePage(mia); clearMemo(); }
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
  test("#215 the weekly review leaves chores on track out of Actions, and deals one missed for 2 rounds", async () => {
    const path = choreProject("chores review", [chore("Empty the dishwasher [[c/home/kitchen]]", "weekly", 2),
      chore("Clean the oven [[c/home/kitchen]]", "weekly", -15)]);
    const [fresh, stale] = getPage(path).blocks;
    const inDeck = b => actDeck().some(a => a.block === b);
    try {
      PREF.set("review.chores", "");
      ok(!inDeck(fresh), "a chore on track is left out");
      ok(inDeck(stale), "a chore 3 rounds behind is dealt");
      ok(!ACT_PASSES.some((p, n) => actOrder(n).some(a => a.block === fresh)), "in no pass at all");
      ok(actChoresOut() >= 1, "counted as left out");
      PREF.set("review.chores", "0");
      ok(!inDeck(stale), "0 leaves every chore out");
      PREF.set("review.chores", "4");
      ok(!inDeck(stale), "4 rounds: not yet");
      PREF.set("review.chores", "");
      const still = actFields().find(f => f.k === "still");
      const r = actDeck().find(a => a.block === stale);
      const opts = still.opts(r).map(([v]) => v);
      ok(opts.includes("often") && !opts.includes("note") && !opts.includes("wait"), "a chore is asked how often: " + opts);
      ok(!still.opts(actDeck().find(a => !isChore(a)) || {block: newBlock({title: "x"})}).map(([v]) => v).includes("often"), "an action is not");
      go("review", {sub: "actions"}); await settle();
      ok(content().querySelector(".actchores"), "the review says chores are left out");
      still.pick(r, "often"); await settle();
      ok(document.querySelector(".scrim .modal"), "Change how often opens the repeat dialog");
      closeModal(); await settle();
      // Done already in the review puts the next round in, as a tick on Chores does.
      still.pick(r, "done"); await settle();
      ok(!document.querySelector(".scrim .modal"), "no Again? dialog");
      eq(getPage(path).blocks.filter(b => b.title.startsWith("Clean the oven")).map(b => b.state), ["DONE"]);
      ok(allChores().some(a => a.path !== path && plainTitle(a.title).startsWith("Clean the oven")), "the next round is on the Journal (#212)");
    } finally { PREF.set("review.chores", ""); closeDoneToast(); closeModal(); dropChores(path); }
  });
  test("#213 Chores sorts the rooms by freshness, and the board puts them in red, yellow and green", async () => {
    const path = choreProject("chores board", [
      chore("Wipe the counters #30m [[c/home/testred]]", "daily", -2),
      chore("Scrub the shower [[c/home/testyellow]]", "weekly", 3),
      chore("Clean the fridge [[c/home/testgreen]]", "monthly", 20)]);
    const was = ["chores.layout", "chores.sort", "chores.room"].map(k => [k, PREF.get(k, "")]);
    try {
      const mine = n => "@home/test" + n;
      const chips = () => [...content().querySelectorAll(".choreroom .choreroom-n")].map(n => n.textContent)
        .filter(t => /test(red|yellow|green)/.test(t));
      PREF.set("chores.layout", ""); PREF.set("chores.room", "");
      PREF.set("chores.sort", ""); go("chores"); await settle();
      eq(chips().map(t => t.replace(/^\W*/, "")), ["testgreen", "testred", "testyellow"], "by name");
      PREF.set("chores.sort", "stale"); render(); await settle();
      eq(chips().map(t => t.replace(/^\W*/, "")), ["testred", "testyellow", "testgreen"], "stalest first");
      PREF.set("chores.sort", "fresh"); render(); await settle();
      eq(chips().map(t => t.replace(/^\W*/, "")), ["testgreen", "testyellow", "testred"], "freshest first");

      [...content().querySelectorAll(".chorelayout .fchip")].find(n => n.textContent === "Board").click(); await settle();
      eq(PREF.get("chores.layout", ""), "board", "the board is remembered");
      ok(!content().querySelector(".chorerooms"), "no chips on the board");
      eq([...content().querySelectorAll(".chorecol")].map(n => n.classList[1]), ["green", "yellow", "red"], "freshest first: green first");
      const colOf = n => [...content().querySelectorAll(".chorecol")].find(col =>
        [...col.querySelectorAll(".chorecard .choreroom-n")].some(x => x.textContent.endsWith("test" + n)));
      for (const n of ["red", "yellow", "green"]) ok(colOf(n) && colOf(n).classList.contains(n), "test" + n + " is in " + n);
      const card = [...content().querySelectorAll(".chorecard")].find(x => x.textContent.includes("testred"));
      ok(/1 due/.test(card.textContent) && /30 min/.test(card.textContent), "the card says what is due and how long: " + card.textContent);
      PREF.set("chores.sort", "stale"); render(); await settle();
      eq([...content().querySelectorAll(".chorecol")].map(n => n.classList[1]), ["red", "yellow", "green"], "stalest first: red first");

      [...content().querySelectorAll(".chorecard")].find(x => x.textContent.includes("testred")).click(); await settle();
      eq(PREF.get("chores.room", ""), mine("red"), "a card picks its room, as a chip does");
      const up = content().querySelector(".chorecloseup");
      ok(up && up.textContent.includes("Stalest") && up.textContent.includes("Wipe the counters"), "the close-up shows the stalest");
      ok(up.textContent.includes("Time due now") && up.textContent.includes("30 min"), "and the time due now");
      ok(content().textContent.includes("Wipe the counters") && !content().textContent.includes("Scrub the shower"),
        "only that room's chores below");
    } finally { for (const [k, v] of was) PREF.set(k, v); CHORE_COLS_OPEN.clear(); dropChores(path); render(); }
  });
  test("#213 a long board column shows the first rooms and + n more", async () => {
    const path = choreProject("chores long", Array.from({length: CHORE_COL_MAX + 3}, (_, i) =>
      chore("Dust [[c/home/testlong" + i + "]]", "daily", -3)));
    const was = ["chores.layout", "chores.sort"].map(k => [k, PREF.get(k, "")]);
    try {
      PREF.set("chores.layout", "board"); PREF.set("chores.sort", "stale"); go("chores"); await settle();
      const red = () => content().querySelector(".chorecol.red");
      ok(red().querySelectorAll(".chorecard").length === CHORE_COL_MAX, "only the first " + CHORE_COL_MAX);
      const more = red().querySelector(".chorecol-more");
      ok(more && /^\+ \d+ more$/.test(more.textContent), "a + n more line");
      more.click(); await settle();
      ok(red().querySelectorAll(".chorecard").length >= CHORE_COL_MAX + 3, "all of them after it");
    } finally { for (const [k, v] of was) PREF.set(k, v); CHORE_COLS_OPEN.clear(); dropChores(path); render(); }
  });
  test("#235 Print puts what is due now and this week on one sheet, by room, as the view shows it", async () => {
    const path = choreProject("chores print", [
      chore("Wipe the testprint counters #15m [[c/home/testprintk]]", "daily", -3),
      chore("Clean the testprint sink [[c/home/testprintb]]", "weekly", 2),
      chore("Wash the testprint mats [[c/home/testprintb]]", "monthly", 25)]);
    const was = ["chores.room", "chores.who", "chores.layout"].map(k => [k, PREF.get(k, "")]);
    const print = window.print;
    let printed = 0;
    window.print = () => { printed++; };
    try {
      PREF.set("chores.room", ""); PREF.set("chores.who", "all"); PREF.set("chores.layout", "");
      go("chores"); await settle();
      const btn = content().querySelector(".vhead .printbtn");
      ok(btn && btn.textContent === "Print", "a Print button in the Chores header");
      btn.click(); await settle();
      eq(printed, 1, "the browser's print is opened");
      ok(document.body.classList.contains("printsheet"), "only the sheet is printed");
      const sheet = document.querySelector("#printsheet");
      ok(sheet && sheet.parentNode === document.body, "the sheet is outside the app");
      const text = sheet.textContent;
      has(text, "week " + isoWeek(T())[0], "the week");
      has(text, "Wipe the testprint counters", "due now");
      has(text, "Clean the testprint sink", "coming up this week");
      ok(!text.includes("Wash the testprint mats"), "fresh ones are left out");
      const row = [...sheet.querySelectorAll("tr")].find(r => r.textContent.includes("counters"));
      has(row.textContent, "LATE", "late in capitals");
      has(row.textContent, "daily", "how often");
      has(row.textContent, "15 min", "the time from the size");
      ok(row.querySelector(".ps-box"), "a box to tick");
      const rooms = [...sheet.querySelectorAll(".ps-room th:first-child")].map(n => n.textContent);
      ok(rooms.findIndex(t => t.includes("testprintb")) < rooms.findIndex(t => t.includes("testprintk")), "rooms by name: " + rooms);
      window.dispatchEvent(new Event("afterprint"));
      ok(!document.querySelector("#printsheet") && !document.body.classList.contains("printsheet"), "gone after printing");

      PREF.set("chores.room", "@home/testprintk"); render(); await settle();
      content().querySelector(".printbtn").click(); await settle();
      const one = document.querySelector("#printsheet").textContent;
      ok(one.includes("counters") && !one.includes("testprint sink"), "the room picked is the room printed");
      window.dispatchEvent(new Event("afterprint"));
    } finally {
      window.print = print;
      window.dispatchEvent(new Event("afterprint"));
      for (const [k, v] of was) PREF.set(k, v); dropChores(path); render();
    }
  });
  test("#235 the browser's own Print opens the folds, and closes them again after", async () => {
    const path = choreProject("chores fold", [chore("Dust the testfold shelf [[c/home]]", "weekly", 3)]);
    const was = PREF.get("chores.who", "");
    try {
      PREF.set("chores.who", "all"); go("chores"); await settle();
      const fold = content().querySelector("details.fold");
      ok(fold && !fold.open, "Coming up this week starts closed");
      window.dispatchEvent(new Event("beforeprint"));
      ok(fold.open, "open on paper");
      window.dispatchEvent(new Event("afterprint"));
      ok(!fold.open, "closed again after");
    } finally { PREF.set("chores.who", was); dropChores(path); render(); }
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
      ok(card.classList.contains("wide"), "a card with contexts inside takes the whole row");
      const kn = kid.querySelector(".ctxkn");
      ok(getComputedStyle(kn).whiteSpace === "nowrap" && kid.getBoundingClientRect().height < 32, "the row is one line, the name never wraps");
      eq(kid.children.length, 4, "a row keeps every column, so the numbers line up");
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
  test("#257 Contexts › Sort stacks a context on another by drag, and ⋯ takes it out again", () => {
    makeContext("Testsorthome");
    const path = choreProject("sort ctx", [stampAuthor(newBlock({state: "TODO", title: "Wipe the bench [[c/testsortroom]]"}))]);
    const row = n => [...content().querySelectorAll(".ctxsrow")].find(r => r.dataset.ctx === n);
    const drag = (from, to) => {
      from.dispatchEvent(new DragEvent("dragstart", {bubbles: true}));
      to.dispatchEvent(new DragEvent("dragover", {bubbles: true, cancelable: true}));
      to.dispatchEvent(new DragEvent("drop", {bubbles: true, cancelable: true}));
    };
    try {
      pickSub("contexts", "sort"); render();
      ok(row("testsortroom"), "a context only named on a task is a row too");
      ok(content().querySelector(".ctxtop"), "the top line to take one out");
      drag(row("testsortroom"), row("Testsorthome"));
      ok(getPage(contextPath("Testsorthome/testsortroom")), "it is inside now");
      has(getPage(path).blocks[0].title, "[[c/Testsorthome/testsortroom]]");
      const kid = row("Testsorthome/testsortroom");
      ok(kid, "it is drawn under its new home");
      eq(kid.style.getPropertyValue("--d"), "1", "one step in");
      eq(kid.querySelector(".ctxsname").textContent, "@testsortroom", "named by its own part");
      drag(row("Testsorthome"), kid);
      ok(getPage(contextPath("Testsorthome")), "a context cannot go inside one of its own");
      kid.querySelector(".ctxmore").click();
      const modal = [...document.querySelectorAll(".scrim .modal")].pop();
      const top = [...modal.querySelectorAll("button, [role=option], li, .row")].find(n => n.textContent.trim().endsWith("On its own, at the top"));
      ok(top, "⋯ offers the top");
      top.click();
      ok(getPage(contextPath("testsortroom")) && !getPage(contextPath("Testsorthome/testsortroom")), "out again");
      has(getPage(path).blocks[0].title, "[[c/testsortroom]]");
      undoLast();
      has(getPage(path).blocks[0].title, "[[c/Testsorthome/testsortroom]]", "Undo puts it back inside");
    } finally {
      closeModal(); PREF.set("sub.contexts", "cards"); go("contexts"); dropChores(path);
      for (const n of ["Testsorthome/testsortroom", "testsortroom", "Testsorthome"]) if (getPage(contextPath(n))) removePage(contextPath(n));
    }
  });
  test("#304 Contexts › Sort draws each area as its own column, and a context moves or copies into another area", async () => {
    const other = "Test304 Other", wasVisible = PREF.get("visibleSpaces", "");
    LOADED.set(other, newRecord(other, Backends.memory(other)));
    Spaces.list.push({name: other, kind: "memory"});
    makeContext("Test304cp"); makeContext("Test304cp/Test304kid");
    makeContext("Test304mv");
    try {
      setVisibleSpaces([V.space, other]); clearMemo();
      pickSub("contexts", "sort"); render();
      const cols = content().querySelectorAll(".ctxcol");
      eq(cols.length, 2, "one column per visible area");
      ok(cols[0].textContent.includes(V.space) || cols[1].textContent.includes(V.space), "a column names its area");
      const here = V.space;
      await transferContextBranch(here, "Test304cp", other, {mode: "copy"});
      ok(getPage(contextPath("Test304cp")), "left behind: it was a copy");
      ok(getPage(contextPath("Test304cp/Test304kid")), "its child left behind too");
      inSpace(other, () => {
        ok(getPage(contextPath("Test304cp")), "copied into the other area");
        ok(getPage(contextPath("Test304cp/Test304kid")), "the nested child came with it");
      });
      await transferContextBranch(here, "Test304mv", other, {mode: "move"});
      ok(!getPage(contextPath("Test304mv")), "moved: gone from here");
      inSpace(other, () => ok(getPage(contextPath("Test304mv")), "moved: arrived in the other area"));
    } finally {
      removePage(contextPath("Test304cp")); removePage(contextPath("Test304cp/Test304kid")); removePage(contextPath("Test304mv"));
      inSpace(other, () => {
        removePage(contextPath("Test304cp")); removePage(contextPath("Test304cp/Test304kid")); removePage(contextPath("Test304mv"));
      });
      LOADED.delete(other);
      Spaces.list = Spaces.list.filter(s => s.name !== other);
      setVisibleSpaces(wasVisible ? JSON.parse(wasVisible) : []);
      document.querySelectorAll("#toasts .toast").forEach(x => x.remove());
      PREF.set("sub.contexts", "cards"); go("contexts"); clearMemo();
    }
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
  test("#204 in the sidebar a context folds away the contexts inside it", () => {
    makeContext("Testfoldtop"); makeContext("Testfoldtop/Testfoldkid");
    clearMemo();
    const was = [PREF.get("nav.ctxOpen", "0"), PREF.get("nav.ctxKids", "[]")];
    const row = name => [...document.querySelectorAll("#nav .nav-sub")].find(b => b.querySelector(".lbl")?.textContent === name);
    try {
      PREF.set("nav.ctxOpen", "1"); PREF.set("nav.ctxKids", "[]"); renderNav();
      const top = row("Testfoldtop");
      ok(top, "the parent is not in the sidebar");
      ok(!row("Testfoldkid"), "the child shows while folded");
      const fold = top.querySelector(".fold");
      eq(fold?.querySelector("svg path")?.getAttribute("d"), ICON_CHEVRON_RIGHT.match(/d="([^"]+)"/)[1], "no fold on the parent");
      fold.click();
      ok(row("Testfoldkid"), "unfolding did not show the child");
      eq(row("Testfoldtop").querySelector(".fold").querySelector("svg path")?.getAttribute("d"), ICON_CARET.match(/d="([^"]+)"/)[1]);
      ok(!row("Testfoldkid").querySelector(".fold"), "a context with nothing inside has no fold");
      row("Testfoldtop").querySelector(".fold").click();
      ok(!row("Testfoldkid"), "folding did not hide the child");
    } finally { PREF.set("nav.ctxOpen", was[0]); PREF.set("nav.ctxKids", was[1]); renderNav(); }
  });
  test("#208 @ finds a child context by its own name, and offers no new one when typed in full", () => {
    makeContext("Testabode2"); makeContext("Testabode2/Testoutside");
    clearMemo();
    const at = text => suggestFor({value: text, selectionStart: text.length}, {});
    const refs = s => (s?.rows || []).filter(r => !r.isNew).map(r => r.ref);
    ok(refs(at("Rake the leaves @testout")).includes("c/Testabode2/Testoutside"), "@testout missed Testabode2/Testoutside");
    ok(refs(at("Rake @testabode2/testo")).includes("c/Testabode2/Testoutside"), "the full path still finds it");
    ok(!at("Rake @testoutside").rows.some(r => r.isNew), "offered a new context with its name");
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
    sel[1].value = "monthly";
    const dur = m.querySelector('input[aria-label="Duration"]'); dur.value = "15m";
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
  test("#279 + New chore: Custom... and Pick a date... come back with the answer", async () => {
    const pick = (label, value) => {
      const s = document.querySelector('.scrim .modal select[aria-label="' + label + '"]');
      s.value = value; s.dispatchEvent(new Event("change"));
    };
    openNewChore("");
    document.querySelector('.scrim .modal input[aria-label="What"]').value = "Test wipe the shelf";
    pick("How often", "\u0003");
    has(document.querySelector(".scrim .modal h2").textContent, "How often");
    [...document.querySelectorAll(".scrim .modal button")].find(n => n.textContent === "Cancel").click();
    await settle();
    let m = document.querySelector(".scrim .modal");
    eq([m.querySelector('input[aria-label="What"]').value, m.querySelector('select[aria-label="How often"]').value], ["Test wipe the shelf", "weekly"], "Cancel keeps the choices");
    pick("How often", "\u0003");
    [...document.querySelectorAll(".scrim .modal .seg button")].find(n => n.textContent === "Custom…").click();
    document.querySelector(".scrim .modal input[type=number]").value = "3";
    document.querySelector(".scrim .modal input[type=number]").dispatchEvent(new Event("input"));
    [...document.querySelectorAll(".scrim .modal button")].find(n => n.textContent === "Save").click();
    await settle();
    m = document.querySelector(".scrim .modal");
    const freq = m.querySelector('select[aria-label="How often"]');
    has(freq.selectedOptions[0].textContent.toLowerCase(), "3");
    eq(m.querySelector('input[aria-label="What"]').value, "Test wipe the shelf");
    pick("First one", "\u0003");
    const d = document.querySelector('.scrim .modal input[type=date]');
    const day = shiftISO(todayISO(), 9); d.value = day;
    [...document.querySelectorAll(".scrim .modal button")].find(n => n.textContent === "Save").click();
    await settle();
    m = document.querySelector(".scrim .modal");
    eq(m.querySelector('select[aria-label="First one"]').value, "on:" + day);
    [...m.querySelectorAll("button")].find(n => n.textContent === "Add chore").click();
    await settle();
    const path = contextPath(ctxSlug("home")), page = getPage(path);
    const b = page.blocks.find(x => x.title.includes("Test wipe the shelf"));
    try {
      ok(b, "the chore was added");
      eq(dueDate(b), day);
      ok(!REPEAT_CHOICES.includes(repeatOf(b)), "a custom rhythm, not a preset");
    } finally { if (b) { page.blocks.splice(page.blocks.indexOf(b), 1); touch(path); clearMemo(); } }
  });
  test("#260 chores reuse a name, group by chore, and print the grouping in view", async () => {
    const path = choreProject("chores reuse", [
      chore(choreLine("Testvacuum", "home/kitchen", 2), "weekly", 0), chore(choreLine("Testvacuum", "home/bedroom", 1), "weekly", 2),
      chore(choreLine("Testvacuum", "home/hall", 1), "monthly", 4), chore(choreLine("Testdust", "home/hall", 1), "weekly", 1)]);
    try {
      for (const open of [() => openNewChore(""), () => openLogChore("")]) {
        open();
        const m = document.querySelector(".scrim .modal"), what = m.querySelector('input[aria-label="What"]');
        const opts = [...document.querySelectorAll("datalist#" + what.getAttribute("list") + " option")].map(o => o.value);
        eq(opts.filter(v => v === "Testvacuum").length, 1, "an existing chore is offered once");
        closeModal();
      }
      PREF.set("chores.group", "chore"); go("chores"); await settle();
      const g = [...content().querySelectorAll(".choregroup")].find(x => /Testvacuum/.test(x.textContent));
      ok(g, "a group for the chore");
      has(g.textContent, "3 rooms"); has(g.textContent, "1 h");
      eq(g.querySelectorAll(".task").length, 3, "one line per room");
      const mine = choreRows().filter(a => a.path === path);
      const sheet = choreSheet(mine, [], () => "@", () => "", [], "chore");
      ok([...sheet.querySelectorAll(".ps-room th")].some(th => th.textContent.startsWith("Testvacuum")), "print groups by chore");
      PREF.set("chores.group", ""); go("chores"); await settle();
      ok(!content().querySelector(".choregroup"), "Room is the default");
    } finally { PREF.set("chores.group", ""); dropChores(path); }
  });
  test("#282 chore time totals: Due now, This week, Print; unsized never guessed", async () => {
    const t = (title, extra) => ({title, ...extra});
    eq(choreTotal([t("A #45m"), t("B #15m"), t("C")]), "1 h + 1 unsized");
    eq(choreTotal([t("A #45m")]), "45 min");
    eq(choreTotal([t("C"), t("D")]), "2 unsized");
    eq(choreTotal([]), "");
    const path = choreProject("chores time", [
      chore(choreLine("Testmop", "home/kitchen", "30m"), "weekly", 0), chore(choreLine("Testwipe", "home/kitchen", 0), "weekly", 0)]);
    try {
      go("chores"); await settle();
      const due = [...content().querySelectorAll(".section h3")].find(h => /^Due now/.test(h.textContent));
      ok(due, "Due now section");
      has(due.textContent, "30 min + 1 unsized");
      const mine = choreRows().filter(a => a.path === path);
      const sheet = choreSheet(mine, ["@"], () => "@", () => "", [], "");
      const tot = sheet.querySelector(".ps-total");
      ok(tot, "print total");
      has(tot.textContent, "This week · 30 min + 1 unsized · 2 chores");
      ok(!sheet.querySelector(".ps-room + tr .ps-sub, .ps-subtotal"), "no room subtotals");
    } finally { dropChores(path); }
  });
  test("#239 + New chore, As needed: a plain line with no first day", async () => {
    openNewChore("");
    const m = document.querySelector(".scrim .modal");
    m.querySelector('input[aria-label="What"]').value = "Test sort the recycling";
    const freq = m.querySelector('select[aria-label="How often"]');
    freq.value = "as needed"; freq.dispatchEvent(new Event("change"));
    ok(m.querySelector('select[aria-label="First one"]').closest(".field").hidden, "no First one to pick");
    [...m.querySelectorAll("button")].find(n => n.textContent === "Add chore").click();
    await settle();
    const path = contextPath(ctxSlug("home")), page = getPage(path);
    const b = page.blocks.find(x => x.title.includes("Test sort the recycling"));
    try {
      ok(b, "on the @home page");
      eq([b.state || "", repeatOf(b), dueDate(b)], ["", "as needed", null]);
      ok(asNeededChores().some(a => a.block === b), "an as-needed chore");
    } finally { if (b) { page.blocks.splice(page.blocks.indexOf(b), 1); touch(path); clearMemo(); } }
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
  test("cycleState walks TODO -> DOING -> WAIT -> HOLD -> DONE -> CANCELLED -> note", () => {
    const path = scratchProject("cycle", [["TODO", "Cycle me"]]);
    const seen = [];
    for (let i = 0; i < 6; i++) {
      cycleState(path, getPage(path).blocks[0]);
      seen.push(getPage(path).blocks[0].state);
      if (typeof closeModal === "function") closeModal();
    }
    eq(seen, ["DOING", "WAIT", "HOLD", "DONE", "CANCELLED", null]);
  });
  test("#305 HOLD is a state: parses, serializes and counts as open", () => {
    const path = scratchProject("hold-state", [["HOLD", "Wait out the rain"]]);
    const b = getPage(path).blocks[0];
    eq(b.state, "HOLD", "parsed as a state, not swallowed as text");
    eq(serializeBlockLines([b])[0], "- HOLD Wait out the rain");
    ok(OPEN_STATES.HOLD, "a held task is open, not done or cancelled");
    setBlockState(path, b, "DONE");
    eq(getPage(path).blocks[0].state, "DONE", "HOLD -> DONE works like any other state change");
  });
  test("#305 task detail panel: HOLD in the state bar, autosave, no footer, overflow menu", () => {
    const path = scratchProject("panel", [["TODO", "Finish the thing"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const seg = [...m.querySelectorAll(".seg")][0];
      const states = [...seg.querySelectorAll("button")].map(x => x.textContent);
      eq(states, ["TODO", "DOING", "WAIT", "HOLD", "DONE"], "Cancelled and Not a task are not in the main bar");
      ok(!m.querySelector(".foot"), "no Save/Cancel footer left to batch changes into");

      const title = m.querySelector("textarea");
      title.value = "Finish the other thing";
      title.dispatchEvent(new Event("blur"));
      eq(b.title, "Finish the other thing", "title autosaves on blur, with no Save click");

      [...seg.querySelectorAll("button")].find(x => x.textContent === "HOLD").click();
      eq(getPage(path).blocks[0].state, "HOLD", "picking HOLD autosaves the state");

      const menuBtn = [...m.querySelectorAll("header button")].find(x => x.textContent === "⋯");
      menuBtn.click();
      const menu = document.querySelector(".linkpop");
      ok(menu, "the overflow menu opens");
      const items = [...menu.querySelectorAll(".pick")].map(x => x.textContent);
      eq(items, ["Cancel task", "Convert to note", "Move to another area", "Delete task"],
        "#308 folds the tab bar's separate Move action into this one menu");
      [...menu.querySelectorAll(".pick")].find(x => x.textContent === "Cancel task").click();
      eq(getPage(path).blocks[0].state, "CANCELLED");
      ok(!document.querySelector(".linkpop"), "the menu closes after acting");
    } finally { closeModal(); }
  });
  test("#307 task detail panel: Scheduled/Deadline/Assign/Priority start as + pills when unset", () => {
    const path = scratchProject("progressive", [["TODO", "File the taxes"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const pillText = t => [...m.querySelectorAll(".fpill")].find(x => x.textContent === t);

      ok(pillText("+ Scheduled"), "Scheduled starts as a pill");
      ok(pillText("+ Deadline"), "Deadline starts as a pill");
      ok(pillText("+ Priority"), "Priority starts as a pill");
      ok(pillText("+ Assign"), "Assign starts as a pill");
      ok(!m.querySelector(".dt"), "no date input mounted until a pill is clicked");

      pillText("+ Deadline").click();
      const dead = m.querySelectorAll(".dt")[0].querySelector('input[type="date"]');
      ok(document.activeElement === dead, "clicking the pill mounts and focuses the real control");
      dead.value = "2027-05-01";
      dead.dispatchEvent(new Event("change"));
      eq(dateIn(blockProp(b, "DEADLINE")), "2027-05-01", "the mounted field still saves normally");

      pillText("+ Priority").click();
      const pri = [...m.querySelectorAll("select")].find(s => [...s.options].some(o => o.textContent === "High"));
      pri.value = "H";
      pri.dispatchEvent(new Event("change"));
      eq(priorityOf(b), "H");

      pillText("+ Assign").click();
      ok([...m.querySelectorAll("label")].some(x => x.textContent === "Who is doing it"),
        "the assign pill mounts the real row");

      ok(![...m.querySelectorAll("button")].some(x => x.textContent === "Make it my usual"),
        "the per-task reminder-default button is gone");
      ok(![...m.querySelectorAll("button")].some(x => x.textContent === "Choose where"),
        "the calendar provider picker button is gone");
      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "Urgency"), "the Urgency readout is gone");
      ok(!/Somebody in this area gets it as their task/.test(m.textContent),
        "the instructional paragraph under Assign is gone");
      ok(!/The file route sends nothing anywhere/.test(m.textContent),
        "the instructional paragraph under Calendar is gone");
    } finally { closeModal(); }
  });
  test("#305 task detail panel: one date row, labeled and backed by state", () => {
    const path = scratchProject("sched-unify", [["TODO", "Call the plumber"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const seg = [...m.querySelectorAll(".seg")][0];
      const pill = [...m.querySelectorAll(".fpill")].find(x => x.textContent === "+ Scheduled");
      ok(pill, "an unset Scheduled date starts as a + pill, not an empty field");
      pill.click();
      const schedField = m.querySelectorAll(".dt")[0].parentNode;
      const label = schedField.querySelector("label");
      const input = schedField.querySelector('input[type="date"]');
      eq(label.textContent, "Scheduled", "TODO shows Scheduled");

      input.value = "2027-01-02";
      input.dispatchEvent(new Event("change"));
      eq(dateIn(blockProp(b, "SCHEDULED")), "2027-01-02", "writes SCHEDULED while open");

      [...seg.querySelectorAll("button")].find(x => x.textContent === "WAIT").click();
      eq(label.textContent, "Follow up", "WAIT relabels the same row");

      [...seg.querySelectorAll("button")].find(x => x.textContent === "HOLD").click();
      eq(label.textContent, "Hold until", "HOLD relabels the same row");
      ok(!input.value, "no SCHEDULED date leaks into the hold field");

      input.value = "2027-03-04";
      input.dispatchEvent(new Event("change"));
      eq(holdValue(blockProp(b, "hold")), "2027-03-04", "HOLD writes hold:: from the same field");
      eq(dateIn(blockProp(b, "SCHEDULED")), "2027-01-02", "the old SCHEDULED date is left alone, not overwritten");

      const openRow = schedField.querySelectorAll("label")[1];
      const checkbox = openRow.querySelector("input[type=checkbox]");
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change"));
      eq(blockProp(b, "hold"), HOLD_OPEN, "no date: until I take it off writes HOLD_OPEN");

      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "On hold until"),
        "the separate On hold until field is gone");
    } finally { closeModal(); }
  });
  test("#305 a HOLD task resumes to TODO once its hold:: day arrives", () => {
    const path = scratchProject("resume-hold", [["HOLD", "Call back in spring"]]);
    const b = getPage(path).blocks[0];
    setBlockProp(b, "hold", "[[" + shiftISO(todayISO(), -1) + "]]");
    touch(path); clearMemo();
    resumeHeldTasks();
    eq(getPage(path).blocks[0].state, "TODO", "the day has passed, so it is a task again");
    ok(!blockProp(getPage(path).blocks[0], "hold"), "the hold:: prop is cleared");
  });
  test("#305 an indefinite hold (no date) never auto-resumes", () => {
    const path = scratchProject("resume-hold-open", [["HOLD", "Someday"]]);
    const b = getPage(path).blocks[0];
    setBlockProp(b, "hold", HOLD_OPEN);
    touch(path); clearMemo();
    resumeHeldTasks();
    eq(getPage(path).blocks[0].state, "HOLD", "no date means no day to resume on");
  });
  test("#308 task detail panel: one header, no duplicate tab bar", () => {
    const path = scratchProject("one-header", [["TODO", "Pack for the trip"]]);
    const b = getPage(path).blocks[0];
    try {
      openTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      eq(m.querySelectorAll("header").length, 1, "a single header bar, not a stacked pair");
      ok(!m.querySelector(".detail-tools"), "the icon-only tab bar is gone");
      ok(!m.querySelector(".detail-pane"), "nothing is hidden behind a tab anymore");
      const header = m.querySelector("header");
      has(header.textContent, path, "the source path lives in the one remaining header");
      ok([...header.querySelectorAll("button")].some(x => x.textContent === "✕"), "close stays in that same header");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: WHERE IT SITS trimmed to Project/Parent/Tags", () => {
    const path = scratchProject("trim-sits", [["TODO", "Mow the lawn"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const cells = [...m.querySelectorAll(".acell")].map(c => [...c.classList].find(cl => cl.startsWith("a-")));
      eq(cells.sort(), ["a-parent", "a-project", "a-tags"], "This todo, Siblings and Children boxes are gone");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: one Subtasks section, checklist of actual children", () => {
    const path = scratchProject("subtasks", [["TODO", "Plan the trip"]]);
    const b = getPage(path).blocks[0];
    const kid = stampAuthor(newBlock({state: "TODO", title: "Book flights", props: {}}));
    b.children = [kid];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      ok(!m.querySelector(".acell.a-kids"), "the bordered Children box is gone");
      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "children"), "the separate lowercase children row is gone");
      const row = [...m.querySelectorAll(".subkid")].find(r => r.textContent.includes("Book flights"));
      ok(row, "the nested child shows as a checklist row");
      const cb = row.querySelector('input[type="checkbox"]');
      ok(!cb.checked, "open child starts unchecked");
      cb.checked = true;
      cb.dispatchEvent(new Event("change"));
      eq(kid.state, "DONE", "checking it off marks the subtask done");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: unset +pills share one flex-wrap row", () => {
    const path = scratchProject("pillrow", [["TODO", "Renew the passport"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const row = m.querySelector(".pillrow");
      ok(row, "Scheduled/Deadline/Assign/Priority share a pillrow container");
      const texts = [...row.querySelectorAll(".fpill")].map(x => x.textContent);
      eq(texts, ["+ Scheduled", "+ Deadline", "+ Assign", "+ Priority"]);
    } finally { closeModal(); }
  });
  test("#308 task detail panel: no Title or State labels", () => {
    const path = scratchProject("no-labels", [["TODO", "Clean the garage"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const labels = [...m.querySelectorAll("label")].map(x => x.textContent);
      ok(!labels.includes("Title"), "Title label is gone, the textarea speaks for itself");
      ok(!labels.includes("State"), "State label is gone, the segmented control speaks for itself");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: no standalone GTD hygiene row; verb nudge inline on Title", () => {
    const path = scratchProject("verb-nudge", [["TODO", "the garage"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "GTD hygiene"),
        "the standalone GTD hygiene row is gone");
      const nudge = [...m.querySelectorAll(".achip.want")].find(x => x.textContent === "! add a verb");
      ok(nudge && nudge.style.display !== "none", "a verb-less title shows the inline nudge");

      const title = m.querySelector("textarea");
      title.value = "Clean the garage";
      title.dispatchEvent(new Event("blur"));
      eq(nudge.style.display, "none", "the nudge hides once the title starts with a verb");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: Project cell nudges a refile when the task is unfiled", () => {
    const day = journalPath("2026-06-01");
    putPage(day, parsePage(["- TODO Sort the recycling"]));
    const b = getPage(day).blocks[0];
    try {
      showTaskDetail(day, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      const nudge = m.querySelector(".acell.a-project .achip.want");
      ok(nudge, "an unfiled task's Project cell is a refile nudge");
      has(nudge.textContent, "!");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: Subtasks has one add/link control, not two", () => {
    const path = scratchProject("one-subtask-control", [["TODO", "Ship the release"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      ok(![...m.querySelectorAll(".fpill")].some(x => x.textContent === "+ Add subtask"),
        "no separate + Add subtask pill beside the children:: picker");
    } finally { closeModal(); }
  });
  test("#308 task detail panel: Auto-cancel after lives in the Deadline row; Add to calendar in Scheduled", () => {
    const path = scratchProject("merge-until-cal", [["TODO", "Chase the invoice"]]);
    const b = getPage(path).blocks[0];
    try {
      showTaskDetail(path, b, V.space);
      const m = document.querySelector("#modalRoot .modal");
      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "Cancel it if still open after"),
        "the standalone until field is gone");
      ok(![...m.querySelectorAll("label")].some(x => x.textContent === "Calendar"),
        "the standalone Calendar field is gone");

      [...m.querySelectorAll(".fpill")].find(x => x.textContent === "+ Deadline").click();
      has([...m.querySelectorAll("label")].map(x => x.textContent).join(" "), "Auto-cancel after");

      [...m.querySelectorAll(".fpill")].find(x => x.textContent === "+ Scheduled").click();
      ok([...m.querySelectorAll("button")].some(x => x.textContent === "Add to calendar"),
        "Add to calendar sits inside the open Scheduled field");
    } finally { closeModal(); }
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
  test("#263 an undated step takes the date of the nearest dated line above it", () => {
    const path = scratchProject("inherit due");
    const late = shiftISO(todayISO(), -2), wed = shiftISO(todayISO(), 3), fri = shiftISO(todayISO(), 5);
    getPage(path).blocks = parsePage([
      "- TODO Send quarterly report",
      "  - TODO Collect figures",
      "  - TODO Draft summary",
      "  - Notes from Ann",
      "    - TODO Check the totals",
      "- DONE Closed parent",
      "  - TODO Loose step",
    ].join("\n")).blocks;
    const [top, closed] = getPage(path).blocks;
    setDue(top, fri); setDue(top.children[0], wed); setDue(closed, late);
    clearMemo();
    try {
      const row = t => leafActions().find(a => a.path === path && a.block.title === t);
      ok(!row("Send quarterly report"), "the parent is still not an action");      eq(row("Collect figures").due, wed, "its own date wins");
      eq(row("Draft summary").due, fri, "inherited");
      eq(row("Check the totals").due, fri, "through a line with no date");
      eq(row("Loose step").due, null, "a closed line gives no date");
      ok(!dueDate(row("Draft summary").block), "nothing is written to the step");
      setDue(getPage(path).blocks[0], late);
      clearMemo();
      eq(row("Draft summary").due, late, "moves with the parent");
      eq(row("Draft summary").group, "LATE", "late with the parent");
      // Every step done: the parent is the action again, with its own date.
      for (const b of flattenBlocks(getPage(path).blocks[0].children)) if (b.state === "TODO") b.state = "DONE";
      clearMemo();
      eq(row("Send quarterly report").due, late);
    } finally { removePage(path); clearMemo(); }
  });
  test("#263 a step dated after its parent is warned about, once, and kept", () => {
    const path = scratchProject("due conflict");
    const wed = shiftISO(todayISO(), 3), fri = shiftISO(todayISO(), 5), mon = shiftISO(todayISO(), 8);
    getPage(path).blocks = parsePage([
      "- TODO Send quarterly report",
      "  - TODO Collect figures",
      "  - TODO Draft summary",
    ].join("\n")).blocks;
    const [parent] = getPage(path).blocks, [undated, dated] = parent.children;
    setDue(parent, fri); setDue(dated, wed);
    const toasts = () => [...document.querySelectorAll("#toasts .toast.warn")].map(t => t.textContent).join("|");
    $("#toasts").replaceChildren();
    try {
      ok(!warnDueConflict(path, undated), "an inherited date never warns");
      ok(!warnDueConflict(path, dated), "before the parent is fine");
      setDue(dated, mon);
      ok(warnDueConflict(path, dated), "a step after its parent");
      has(toasts(), "Send quarterly report");
      eq(dueDate(dated), mon, "the date stays as given");
      setDue(dated, wed); setDue(parent, shiftISO(todayISO(), 1));
      $("#toasts").replaceChildren();
      ok(warnDueConflict(path, parent), "a parent moved before its step");
      has(toasts(), "Draft summary");
    } finally { $("#toasts").replaceChildren(); removePage(path); clearMemo(); }
  });
  test("#265 the date popover says Due or Scheduled and switches between them", () => {
    const path = scratchProject("date kind");
    getPage(path).blocks = parsePage("- TODO Book the venue").blocks;
    const [b] = getPage(path).blocks, fri = shiftISO(todayISO(), 5);
    setBlockProp(b, "DEADLINE", fri);
    const anchor = document.body;
    try {
      openDueChipMenu({path, block: b, space: null, due: fri}, anchor);
      const pop = () => $("#modalRoot .whenpop");
      const kindBtn = k => [...pop().querySelectorAll(".vseg button")].find(x => x.textContent === k);
      ok(/^Due · /.test($("#modalRoot .modal h2").textContent), "the title names the kind");
      eq(kindBtn("Due").getAttribute("aria-pressed"), "true", "Due is pressed");
      kindBtn("Scheduled").click();
      ok(/^Scheduled · /.test($("#modalRoot .modal h2").textContent), "the title follows the switch");
      [...$("#modalRoot .foot").querySelectorAll("button")].find(x => x.textContent === "Save").click();
      ok(!blockProp(b, "DEADLINE"), "the deadline is gone");
      eq(dateIn(blockProp(b, "SCHEDULED")), fri, "the same day is now scheduled");
    } finally { closeModal(); $("#toasts").replaceChildren(); removePage(path); clearMemo(); }
  });
  test("#265 a new date is Due by default; Scheduled stays Scheduled", () => {
    const path = scratchProject("date default");
    getPage(path).blocks = parsePage("- TODO Book the venue\n- TODO Call the caterer").blocks;
    const [b, c] = getPage(path).blocks, fri = shiftISO(todayISO(), 5);
    setBlockProp(c, "SCHEDULED", todayISO());
    try {
      openDueChipMenu({path, block: b, space: null}, document.body);
      eq([...document.querySelectorAll("#modalRoot .whenpop .vseg button")].find(x => x.textContent === "Due").getAttribute("aria-pressed"), "true", "Due is pressed for a new date");
      closeModal();
      setDue(b, fri);
      eq(dateIn(blockProp(b, "DEADLINE")), fri, "setDue writes a deadline");
      ok(!blockProp(b, "SCHEDULED"), "and no scheduled day");
      setDue(c, fri);
      eq(dateIn(blockProp(c, "SCHEDULED")), fri, "a scheduled day stays scheduled");
      ok(!blockProp(c, "DEADLINE"), "and gains no deadline");
    } finally { closeModal(); $("#toasts").replaceChildren(); removePage(path); clearMemo(); }
  });
  test("urgencyOf gives a number for every open action", () => {
    const acts = allLeafActions();
    ok(acts.length > 10, "only " + acts.length + " actions in the demo");
    for (const a of acts) ok(Number.isFinite(urgencyOf(a)), "urgency of " + a.block.title);
  });

  /* ============================================================
     Pages and links
     ============================================================ */
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
      eq([...bar().querySelectorAll(":scope > .ebtn .elb")].map(n => n.textContent),
        ["Up", "Down", "Outdent", "Indent", "Type", "Tag", "Media", "More"], "the top-level bar is 8 buttons");
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
      await press("type");
      eq([...bar().querySelectorAll(".ebpop .elb")].map(n => n.textContent),
        ["Note", "Zettel", "Project", "Responsibility"], "Type opens to the four kinds");
      await press("kind");
      eq(getPage(path).blocks[1].state, null, "Task/Note did not make it a note");
      ok(!bar().querySelector(".ebpop"), "picking a leaf closes the popover");
      await press("type");
      eq(bar().querySelector('[data-k="kind"] .elb').textContent, "Task", "now offers to make it a task again");
      await press("type");
      document.activeElement.blur();
      await frame();
      ok(bar().hidden, "the toolbar stays after the line is let go");
    } finally { go("today"); }
  });
  test("#300 the toolbar's Tag and Media buttons open to their three or two leaves", async () => {
    const path = scratchProject("edit bar groups", [["TODO", "Buy paint"]]);
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    const bar = () => document.querySelector("#editBar");
    const mm = window.matchMedia;
    try {
      focusBlock(b.id);
      await frame();
      bar().querySelector('[data-k="tag"]').click();
      await frame();
      eq([...bar().querySelectorAll(".ebpop .elb")].map(n => n.textContent), ["Context", "Person", "Organisation"]);
      bar().querySelector('[data-k="tag"]').click();
      await frame();
      ok(!bar().querySelector(".ebpop"), "a second tap on the open group closes it");
      window.matchMedia = q => q === "(pointer:fine)" ? {matches: false} : mm.call(window, q);
      bar().querySelector('[data-k="media"]').click();
      await frame();
      eq([...bar().querySelectorAll(".ebpop .elb")].map(n => n.textContent), ["Photo", "Image"], "a phone offers both");
      bar().querySelector('[data-k="media"]').click();
      await frame();
      window.matchMedia = q => q === "(pointer:fine)" ? {matches: true} : mm.call(window, q);
      const click = HTMLInputElement.prototype.click;
      HTMLInputElement.prototype.click = function () { this.remove(); };
      try { bar().querySelector('[data-k="media"]').click(); } finally { HTMLInputElement.prototype.click = click; }
      await frame();
      ok(!bar().querySelector(".ebpop"), "a mouse has no camera, so Media with one leaf acts instead of opening");
      const icons = [...bar().querySelectorAll(":scope > .ebtn .eic")];
      ok(icons.every(n => !/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(n.textContent)), "no emoji icon on the bar");
    } finally { window.matchMedia = mm; document.activeElement && document.activeElement.blur(); go("today"); }
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
  test("#268 brackets come in pairs and wrap the word the caret is in", async () => {
    const path = scratchProject("auto pair", [["TODO", "Call Anna"]]);
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    try {
      focusBlock(b.id);
      const txt = document.querySelector('.blk[data-id="' + b.id + '"] .txt');
      const key = k => txt.dispatchEvent(new KeyboardEvent("keydown", {key: k, bubbles: true, cancelable: true}));
      setHostText(txt, "Call Anna", 7);
      key("[");
      eq(lineText(txt), "Call [Anna]", "the word was not wrapped");
      eq(caretOffsets(txt).join(), "6,10", "the word is not still picked");
      key("[");
      eq(lineText(txt), "Call [[Anna]]", "[ twice did not make a link");
      setHostText(txt, "Call ", 5);
      key("(");
      eq(lineText(txt), "Call ()", "( did not close");
      eq(caretOffsets(txt).join(), "6,6", "the caret is not between");
      key(")");
      eq(lineText(txt), "Call ()", ") did not step over");
      eq(caretOffsets(txt).join(), "7,7");
      setHostText(txt, "Call {}", 6);
      key("Backspace");
      eq(lineText(txt), "Call ", "Backspace did not take the pair");
    } finally { go("today"); }
  });
  test("#269 |a|b| and Enter makes a Markdown table with a new row", async () => {
    const path = scratchProject("md table", [[null, ""]]);
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    const q = s => document.querySelector('.blk[data-id="' + b.id + '"]' + s);
    const key = (node, k, o = {}) => node.dispatchEvent(new KeyboardEvent("keydown", {key: k, bubbles: true, cancelable: true, ...o}));
    try {
      focusBlock(b.id);
      await settle();
      const txt = q(" .txt");
      txt.focus();
      setHostText(txt, "|Name|Phone|", 12);
      eq(lineText(txt), "|Name|Phone|");
      key(txt, "Enter");
      await settle();
      eq(b.title, "| Name | Phone |", "the header is not set out");
      eq(b.body.join("\n"), "| --- | --- |\n|  |  |", "no | --- | line and empty row under it");
      const row = q(' > .bodyline[data-bi="1"]');
      eq(document.activeElement, row, "the caret is not in the new row");
      eq(caretOffsets(row).join(), "2,2", "the caret is not in the first cell");
      setHostText(row, "| Anna |  |", 6);
      key(row, "Tab");
      eq(caretOffsets(row).join(), "9,9", "Tab did not go to the next cell");
      setHostText(row, "| Anna | 555 |", 14);
      key(row, "Enter");
      await settle();
      eq(b.body.length, 3, "Enter did not add a row");
      key(q(' > .bodyline[data-bi="2"]'), "Enter");
      await settle();
      eq(b.body.length, 2, "Enter on the empty last row did not leave the table");
      eq(getPage(path).blocks.length, 2, "no new bullet after the table");
      document.activeElement.blur();
      await settle();
      const t = q(" .txt table.mdtable");
      ok(t, "the table is not drawn");
      eq([...t.querySelectorAll("th,td")].map(c => c.textContent).join(), "Name,Phone,Anna,555");
      ok(!q(' > .bodyline[data-bi="1"]').offsetParent, "the rows are shown as text as well");
      ok(serializeBlockLines([b], 0).join("\n").includes("  | --- | --- |"), "the file has no Markdown table");
    } finally { go("today"); }
  });
  test("#280 #281 the Table menu edits rows, columns and alignment, one Undo each", async () => {
    const path = scratchProject("md table menu", [[null, "| Item | Qty | Note |"]]);
    const b = getPage(path).blocks[0];
    b.body = ["|------|----:|:----:|", "| A | 1 | x |", "| B | 2 | y |"];
    openPage(path);
    await settle();
    const run = (cmd, bi, col) => tableRun(path, b, cmd, bi, col);
    const lines = () => [b.title, ...b.body].join("\n");
    try {
      ok(!tableCan(b, -1, 0).includes("row-del") && !tableCan(b, -1, 0).includes("row-up"), "the header can move or go");
      ok(!tableCan(b, 1, 0).includes("row-up") && !tableCan(b, 2, 0).includes("row-down"), "a row moves past the ends");
      ok(!tableCan(b, 1, 1).includes("al-right") && tableCan(b, 1, 1).includes("al-left"), "the alignment it has is offered");
      run("col-mvright", 1, 1);
      eq(lines(), ["| Item | Note | Qty |", "| --- | :---: | ---: |", "| A | x | 1 |", "| B | y | 2 |"].join("\n"), "the column did not take its alignment along");
      undoLast();
      eq(b.title, "| Item | Qty | Note |", "one Undo did not take the move back");
      eq(b.body[0], "|------|----:|:----:|", "one Undo did not bring the | --- | line back");
      run("row-up", 2, 0);
      eq(b.body[1], "| B | 2 | y |", "the row did not move up");
      run("row-below", -1, 0);
      eq(b.body[0], "|------|----:|:----:|", "the | --- | line moved");
      eq(b.body[1], "|  |  |  |", "no empty row under the header");
      run("col-del", 1, 2);
      eq(b.title, "| Item | Qty |");
      eq(b.body[0], "| --- | ---: |");
      run("al-center", 1, 1);
      eq(b.body[0], "| --- | :---: |");
      run("al-left", 1, 1);
      eq(b.body[0], "| --- | --- |", "left is not saved as ---");
      ok(serializeBlockLines([b], 0).join("\n").includes("  | --- | --- |"), "the file has no Markdown table");
    } finally { go("today"); }
  });
  test("#272 ctrl-click picks lines one by one, and a drag can start on a plain body line", async () => {
    const path = scratchProject("ctrl pick", [["TODO", "One"], ["TODO", "Two"], ["TODO", "Three"], ["TODO", "Four"]]);
    getPage(path).blocks[0].body = ["plain text under One", "and a second plain line"];
    openPage(path);
    await settle();
    const bl = getPage(path).blocks;
    const node = b => document.querySelector('.blk[data-id="' + b.id + '"]');
    const press = (n, o = {}) => n.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true, button: 0, ...o}));
    const picked = () => LINE_SEL.ids.join();
    try {
      press(node(bl[0]).querySelector(".txt"), {ctrlKey: true});
      press(node(bl[2]).querySelector(".txt"), {ctrlKey: true});
      eq(picked(), [bl[0].id, bl[2].id].join(), "ctrl-click did not pick every other line");
      ok(node(bl[0]).classList.contains("lsel") && !node(bl[1]).classList.contains("lsel"), "the picked lines are not painted");
      press(node(bl[1]).querySelector(".txt"), {ctrlKey: true});
      press(node(bl[0]).querySelector(".txt"), {ctrlKey: true});
      eq(picked(), [bl[1].id, bl[2].id].join(), "ctrl-click did not take a line back off, in page order");
      lineSelClear();
      // A press on the plain line under One, dragged onto Three, picks One through Three.
      const body = node(bl[0]).querySelector(":scope > .bodyline");
      ok(body, "the body line is not drawn");
      const under = node(bl[2]).querySelector(".txt");
      const real = document.elementsFromPoint;
      document.elementsFromPoint = () => [under];
      try {
        press(body, {clientX: 5, clientY: 5});
        document.dispatchEvent(new MouseEvent("mousemove", {bubbles: true, cancelable: true, clientX: 5, clientY: 60}));
        document.dispatchEvent(new MouseEvent("mouseup", {bubbles: true}));
      } finally { document.elementsFromPoint = real; }
      eq(picked(), [bl[0].id, bl[1].id, bl[2].id].join(), "the drag from a body line did not pick the lines");
      lineSelClear();
      // Dragging down the plain lines under One alone picks One, with its text.
      const second = node(bl[0]).querySelector(':scope > .bodyline[data-bi="1"]');
      ok(second, "the second body line is not drawn");
      document.elementsFromPoint = () => [second];
      try {
        press(body, {clientX: 5, clientY: 5});
        document.dispatchEvent(new MouseEvent("mousemove", {bubbles: true, cancelable: true, clientX: 5, clientY: 40}));
        document.dispatchEvent(new MouseEvent("mouseup", {bubbles: true}));
      } finally { document.elementsFromPoint = real; }
      eq(picked(), bl[0].id, "the drag across body lines did not pick their line");
    } finally { lineSelClear(); go("today"); }
  });
  test("#267 the ↻ chip and Alt+R open the Repeats dialog", async () => {
    const path = scratchProject("repeat chip", [["TODO", "Water the plants"]]);
    const b = getPage(path).blocks[0];
    setBlockProp(b, REPEAT_PROP, "weekly"); touch(path);
    openPage(path); await settle();
    const title = () => document.querySelector(".scrim .modal h2, .scrim .modal .mhead")?.textContent || "";
    try {
      const pill = document.querySelector('.blk[data-id="' + b.id + '"] .reppill');
      ok(pill, "the repeat is a button");
      pill.click(); await settle();
      has(title(), "Repeats");
      const m = document.querySelector(".scrim .modal");
      [...m.querySelectorAll(".seg button")].find(n => n.textContent === "Daily").click();
      [...m.querySelectorAll("button")].find(n => n.textContent === "Save").click(); await settle();
      eq(repeatOf(getPage(path).blocks[0]), "daily");
      focusBlock(b.id); await settle();
      const txt = document.querySelector('.blk[data-id="' + b.id + '"] .txt');
      flySummon(txt); await settle();
      txt.dispatchEvent(new KeyboardEvent("keydown", {key: "r", code: "KeyR", altKey: true, bubbles: true, cancelable: true}));
      await settle();
      has(title(), "Repeats");
    } finally { closeModal(); go("today"); }
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
  test("#299 the toolbar clears an iPhone's floating keyboard chrome", async () => {
    const path = scratchProject("edit bar ios gap", [["TODO", "Mind the pill"]]);
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    // A phone with its keyboard up: the window keeps its height, the visible part halves.
    const kb = {offsetTop: 0, offsetLeft: 0, width: innerWidth, height: Math.round(innerHeight / 2),
      addEventListener() {}, removeEventListener() {}};
    Object.defineProperty(window, "visualViewport", {configurable: true, get: () => kb});
    const ua = Object.getOwnPropertyDescriptor(Navigator.prototype, "userAgent") ||
      Object.getOwnPropertyDescriptor(navigator, "userAgent");
    openPage(path);
    await settle();
    const b = getPage(path).blocks[0];
    const bar = () => document.querySelector("#editBar");
    try {
      Object.defineProperty(navigator, "userAgent",
        {configurable: true, get: () => "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15"});
      Object.defineProperty(navigator, "standalone", {configurable: true, value: false});
      focusBlock(b.id);
      await frame();
      editBarPlace();
      const plain = innerHeight - kb.height - kb.offsetTop;
      eq(parseFloat(bar().style.bottom), plain + 56, "an iPhone tab gets no extra room above the keyboard");
      Object.defineProperty(navigator, "standalone", {configurable: true, value: true});
      editBarPlace();
      eq(parseFloat(bar().style.bottom), plain, "an installed app has no pill to clear, so no extra room");
    } finally {
      delete window.visualViewport;
      Object.defineProperty(navigator, "userAgent", ua);
      delete navigator.standalone;
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
    const mm = window.matchMedia;
    window.matchMedia = q => q === "(pointer:fine)" ? {matches: false} : mm.call(window, q);
    try {
      focusBlock(b.id);
      await frame();
      document.querySelector('#editBar [data-k="media"]').click();
      await frame();
      const click = HTMLInputElement.prototype.click;
      let input = null;
      HTMLInputElement.prototype.click = function () { input = this; };
      try { document.querySelector('#editBar [data-k="image"]').click(); }
      finally { HTMLInputElement.prototype.click = click; }
      ok(input && input.type === "file" && input.accept === "image/*", "no image picker");
      document.querySelector('#editBar [data-k="media"]').click();
      await frame();
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
    } finally { window.matchMedia = mm; go("today"); }
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

  test("#234 a todo made into a project loses its TODO; the way back puts it on again", () => {
    const from = scratchProject("todo to project", [["TODO", "Test paint the fence"], ["DOING", "Test fix the gate"]]);
    const [a, b] = getPage(from).blocks;
    insertMakeLink(from, a, "1/" + slugify(bareLineName(a)));
    eq(a.state, null, "the line is no task any more");
    eq(a.title, "[[1/Test paint the fence]]");
    ok(findExistingPage("1/Test paint the fence"), "the project is there");
    insertMakeLink(from, b, "2/" + slugify(bareLineName(b)));
    eq(b.state, null, "someday too");
    ok(projectLineToTask(from, a), "back to a task");
    eq(a.state, "TODO", "and the TODO is back");
    const c = newBlock({state: "TODO", title: "Test call the painter"});
    getPage(from).blocks.push(c);
    insertMakeLink(from, c, "1/Test paint the fence");
    eq(c.state, "TODO", "a task that only links a project stays a task");
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
  test("#179 a phone whose folder waits for Allow access has no file to send", () => {
    const mm = window.matchMedia, be = V.backend, linked = LINKED, get = Spaces.get;
    window.matchMedia = q => ({matches: /coarse/.test(q), media: q, addEventListener() {}, removeEventListener() {}});
    try {
      LINKED = null;
      V.backend = {kind: "idb"};
      Spaces.get = () => ({name: Spaces.active, kind: "local"});
      ok(phoneLike(), "a browser-storage area on a phone sends the file");
      Spaces.get = () => ({name: Spaces.active, kind: "fs", label: "Phone"});
      ok(!phoneLike(), "a folder area reading from browser storage until allowed asks to send the file");
      syncSendButton();
      ok(document.querySelector("#btnSend").hidden, "the Send button shows on a folder area");
    } finally {
      window.matchMedia = mm; V.backend = be; LINKED = linked; Spaces.get = get;
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
    test("#262 a name offered while typing follows the chosen key", () => {
      for (const k of ["enter", "tab", "both"]) {
        PREF.set("suggest.accept", k);
        eq(suggestTakes("Enter", "word"), k !== "tab", k + ": Enter on a word");
        eq(suggestTakes("Tab", "word"), k !== "enter", k + ": Tab on a word");
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
    test("Settings is grouped rows; Integrations and Advanced open one level down and back", async () => {
      openVaultDialog();
      const groups = () => [...document.querySelectorAll(".modal .sgroup h3")].map(h => h.textContent);
      eq(groups(), ["Vault & sync", "You", "Preferences", "Personal", "GroupToDo"]);
      ok([...document.querySelectorAll(".modal .srow")].every(r => r.querySelector(".slabel")), "every row has a label");
      const open = label => [...document.querySelectorAll(".modal .srow")]
        .find(r => r.querySelector(".slabel").textContent === label).querySelector("button").click();
      open("Integrations");
      ok(document.querySelector(".modal").textContent.includes("Planner"), "Planner is under Integrations");
      closeModal();
      openVaultDialog();
      open("Advanced");
      ok(document.querySelector(".modal"), "Advanced opens");
      closeModal();
    });
    test("#218 Calendars are in a private area's Settings; the Journal only has an import button by its date box", async () => {
      go("today");
      await settle();
      ok(!content().querySelector(".calchip"), "no Calendars status chip on the Journal");
      ok(!content().querySelector('.todayicon[aria-label="Calendars"], .todayicon[title="Calendars"]'), "no Calendars icon on the Journal");
      const imp = content().querySelector(".daybox .dayimport");
      ok(imp, "an import-calendar button sits with the date box");
      imp.click();
      await settle();
      ok(document.querySelector(".modal"), "it opens the Calendars dialog");
      closeModals();
      go("checklists");
      await settle();
      ok(calAreaShared(Spaces.active), "the demo's area is shared");
      ok(!content().querySelector(".calset .calchip"), "no way to add a calendar in a shared area's Settings");
      has(content().querySelector(".calset")?.textContent || "", "private area", "a shared area's Settings says where calendars go");
      ok(HELP.settings.words.includes("calendar") && HELP.settings.words.includes("import"), "Settings help is found by calendar and import");
      const n = "Test218 private", back = Spaces.active;
      await createSpace(n, "local");
      try {
        await openSpace(n);
        go("checklists");
        await settle();
        ok(content().querySelector(".calset .calchip"), "Calendars in a private area's Settings");
        const was = PREF.get(CAL_HOME_KEY, ""), sp = Spaces.get(back), j = sp.joined, o = sp.onlyMe;
        try {
          PREF.set(CAL_HOME_KEY, back);
          sp.joined = true; delete sp.onlyMe;
          eq(calHome(), n, "#218 a remembered shared area does not win over the private area you are on");
        } finally { sp.joined = j; if (o) sp.onlyMe = o; PREF.set(CAL_HOME_KEY, was); }
      } finally { await openSpace(back); await removeArea(n); go("today"); }
    });
  }

  test("Calendars: reminder presets save at once, Custom… holds any times and several, a calendar can have its own (#292); a calendar row says who sees it", async () => {
    const was = PREF.get(MEET_REMIND_KEY, "10"), feeds = PREF.get(CAL_FEEDS_KEY, "[]");
    try {
      PREF.set(MEET_REMIND_KEY, "0");
      eq(meetRemindLead(), null, "a 0 from before means off");
      drawMeetRemind();
      const radios = [...document.querySelectorAll(".modal input[type=radio]")];
      eq(radios.length, 7, "Off, At start and five times");
      ok(!document.querySelector(".modal .foot"), "no Save button");
      radios[1].checked = true; radios[1].dispatchEvent(new Event("change"));
      eq(meetRemindLead(), 0, "At start is 0 minutes before");
      radios[0].checked = true; radios[0].dispatchEvent(new Event("change"));
      eq(meetRemindLead(), null, "Off turns reminders off");
      // Custom… (#292): any number of minutes, hours, days or weeks, several at once.
      PREF.set(MEET_REMIND_KEY, "20");
      eq(meetRemindLeads(), [20], "an old custom value is kept");
      drawMeetRemind();
      ok(![...document.querySelectorAll(".modal input[type=radio]")].some(r => r.checked), "no preset checked for 20 minutes");
      const cust = [...document.querySelectorAll(".modal button")].find(b => /Custom…/.test(b.textContent));
      has(cust?.textContent || "", "20 min before", "Custom… shows the custom reminder");
      cust.click();
      const q = s => document.querySelector(".modal " + s);
      has(q(".remlist").textContent, "20 minutes before");
      const add = (n, unit) => {
        q(".remnum").value = n; q(".remunit").value = unit;
        [...document.querySelectorAll(".modal button")].find(b => /Add reminder/.test(b.textContent)).click();
      };
      add("0", "minutes");
      ok(q(".remerr")?.textContent, "a bad number says why beside the input");
      add("45", "minutes"); add("1", "days"); add("10", "minutes"); add("45", "minutes");
      eq([...document.querySelectorAll(".modal .remlist li")].map(li => li.querySelector("span").textContent),
        ["10 minutes before", "20 minutes before", "45 minutes before", "1 day before"], "sorted, no duplicate");
      document.querySelectorAll(".modal .remlist li button")[1].click();
      [...document.querySelectorAll(".modal button")].find(b => b.textContent === "Done").click();
      eq(meetRemindLeads(), [10, 45, 1440], "Done saves the list");
      has(meetRemindLabel(), "3 reminders");
      drawMeetRemind();
      ok(![...document.querySelectorAll(".modal input[type=radio]")].some(r => r.checked), "several reminders do not check presets");
      setCalFeeds([{url: "https://x.example/a.ics", label: "Work", space: calHome(), also: []}]);
      // Each calendar can have its own reminders after import.
      drawCalendarSettings("https://x.example/a.ics");
      const rrow = [...document.querySelectorAll(".modal .calrow")].find(b => /Reminders/.test(b.textContent));
      has(rrow?.textContent || "", "3 reminders", "a calendar follows Meeting reminders until changed");
      rrow.click();
      const rs = [...document.querySelectorAll(".modal input[type=radio]")];
      rs[6].checked = true; rs[6].dispatchEvent(new Event("change"));
      eq(meetRemindLeads(calFeedId("https://x.example/a.ics")), [60], "the calendar's own reminder");
      eq(meetRemindLeads(), [10, 45, 1440], "other meetings keep theirs");
      drawCalendars();
      const row = document.querySelector(".modal .calrow:nth-of-type(2)")?.textContent || document.querySelector(".modal").textContent;
      has(row, "Private");
      has(row, "Not synced yet");
      ok(!/serve\.py|Alt\+M/.test(document.querySelector(".modal").textContent), "no technical explanation");
    } finally { closeModals(); PREF.set(MEET_REMIND_KEY, was); PREF.set(CAL_FEEDS_KEY, feeds); }
  });
  test("#294 an attendee on an imported meeting does not crash the import", async () => {
    const ics = "BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:test294\nDTSTART:20261110T090000Z\nDTEND:20261110T093000Z\n" +
      "SUMMARY:Test meeting\nATTENDEE;CN=Alice:mailto:alice@example.com\nEND:VEVENT\nEND:VCALENDAR";
    const from = new Date("2026-11-09T00:00:00Z").getTime(), to = new Date("2026-11-12T00:00:00Z").getTime();
    const before = new Set(allPages(isJournalPath));
    try {
      const r = importCalendarText(ics, calHome(), "test294feed", from, to);
      eq(r.added, 1, "the meeting with an attendee still comes in");
      let found = null;
      inSpace(calHome(), () => { for (const p of allPages(isJournalPath)) walkBlocks(getPage(p).blocks, b => {
        if (/Test meeting/.test(b.title)) found = b; }); });
      has(found?.props.attendees || "", "Alice", "the attendee is still linked in");
    } finally {
      inSpace(calHome(), () => { for (const p of allPages(isJournalPath)) if (!before.has(p)) V.pages.delete(p);
        else walkBlocks(getPage(p).blocks, b => { if (blockProp(b, "cal_feed") === "test294feed") removeBlockFrom(getPage(p), b); }); });
      clearMemo();
    }
  });

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
  test("#273 lines move to another area with the pages they link; a page others link to is mirrored", async () => {
    const n = "Test273 work", back = Spaces.active, day = journalPath("2031-05-06");
    await createSpace(n, "local");
    await openSpace(back);
    try {
      putPage(day, parsePage("- Dentist [[Clinic273]] [[Shared273]]\n- Stays here\n"));
      putPage(join(PAGES, "Clinic273.md"), parsePage("- Opening hours\n"));
      putPage(join(PAGES, "Shared273.md"), parsePage("- Also used elsewhere\n"));
      putPage(join(PAGES, "Other273.md"), parsePage("- See [[Shared273]]\n"));
      const id = getPage(day).blocks[0].id;
      eq(linkedMoveKinds([{space: back, path: day, id}]).mirror, [join(PAGES, "Shared273.md")], "only the page others link to is mirrored");
      ok(await moveLinesToArea([{space: back, path: day, id}], n), "the move said no");
      eq(getPage(day).blocks.map(b => b.title), ["Stays here"], "the line left");
      ok(!getPage(join(PAGES, "Clinic273.md")), "a page only the line linked to moved");
      ok(getPage(join(PAGES, "Shared273.md")), "the shared page stayed");
      inSpace(n, () => {
        eq(getPage(day).blocks.map(b => b.title), ["Dentist [[Clinic273]] [[Shared273]]"], "the line arrived on the same day");
        ok(getPage(join(PAGES, "Clinic273.md")), "the moved page arrived");
        ok(getPage(join(PAGES, "Shared273.md")).props.space_sync_id, "the shared page is mirrored");
      });
      has(document.querySelector("#toasts").textContent, "Other pages link to Shared273");
    } finally {
      document.querySelectorAll("#toasts .toast").forEach(t => t.remove());
      for (const p of [day, "Clinic273", "Shared273", "Other273"]) removePage(p.includes("/") ? p : join(PAGES, p + ".md"));
      await openSpace(back); await removeArea(n);
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
  test("#283 a duration tag is exact minutes; dots are only its band; points stay as they were", () => {
    const mins = {"x #5m": 5, "x #20m": 20, "x #90m": 90, "x #1h": 60, "x #1H30m": 90, "x #2h15m": 135,
      "x #15m": 15, "x #30m": 30, "x #45m": 45, "x #60m": 60, "x #0m": null, "x #h": null, "x": null};
    for (const [t, m] of Object.entries(mins)) eq(estMinutes(t), m, t);
    eq([5, 16, 31, 46, 135].map(m => estBand("x #" + m + "m")).join(), "1,2,3,4,4", "bands");
    eq(chorePoints("x #5m"), 1, "points unchanged");
    eq(chorePoints("x #45m"), 3, "points unchanged for a standard tag");
    eq(estFits("p20", estOfRow({title: "x #20m"})), true, "20 min fits 20");
    eq(estFits("p20", estOfRow({title: "x #30m"})), false, "30 min does not");
    eq(estFits("p120", estOfRow({title: "x #2h15m"})), false, "135 min needs more than 2 hours");
    eq(withoutEst("Wipe #2h15m it"), "Wipe it", "custom tag stripped for the dots");
    eq(withEst("Wipe #2h15m", 2), "Wipe #30m", "a dot replaces the custom tag");
    eq(calWhen({title: "x #5m", due: "2026-11-05", time: "09:00"}).endTime, "09:05", "calendar end");
    const size = choreSizePick();
    size.value = "1h30m";
    eq(choreLine("Wipe", "Kitchen", size.value), "Wipe #1h30m [[c/Kitchen]]", "the form takes a duration");
  });

  test("#276 the readable handover page: one file, plain words, history oldest first", () => {
    const path = scratchProject("Storage room", [["TODO", "Order shelving"], ["TODO", "Quote for lighting"], ["DONE", "Clear out the old room"]]);
    const page = getPage(path), title = pageTitle(path);
    page.props.outcome = "The storage room is in use";
    page.props.org = "[[o/Example Org]]";
    const [order, quote, cleared] = page.blocks;
    setDue(order, shiftISO(T(), -3));
    quote.state = "WAIT";
    setBlockProp(cleared, "done_by", "Person C 2026-10-20T10:00:00Z");
    postMessageAs(path, quote, "Asked Person A", "Person C", "2026-10-28T09:00:00Z");
    putPage(journalPath("2026-10-15"), parsePage("- Talked to supplier about [[" + title + "]], 3 weeks lead time\n- Unrelated lunch\n"));
    clearMemo();
    const html = handoverSheetHtml(path, {includeRefs: false, strip: false});
    has(html, "The storage room is in use");
    has(html, "Example Org");
    ok(!html.includes("[[") && !html.includes("::"), "syntax shown as written");
    ok(!html.includes("Unrelated lunch"), "the rest of the day page went out");
    has(html, "3 weeks lead time");
    ok(!/src=|href="http/i.test(html), "fetches something");
    ok(html.indexOf("3 weeks lead time") < html.indexOf("Asked Person A"), "history not oldest first");
    const shown = html.slice(0, html.indexOf('<script id="d"'));
    ok(shown.indexOf("3 weeks lead time") < shown.lastIndexOf("Clear out the old room") &&
       shown.lastIndexOf("Clear out the old room") < shown.indexOf("Asked Person A"), "done step is in the history by date");
    ok(!handoverSheetHtml(path, {includeRefs: false, strip: true}).includes("Person C"), "who did what kept");
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
  test("#174 informed:: is bookkeeping and does not show under the line", () => {
    const path = scratchProject("inform shown", [["TODO", "Report for [[p/Lars Haugen]]"]]);
    const b = getPage(path).blocks[0];
    informSent("Lars Haugen", [{a: {path, block: b, space: V.space, title: b.title}, was: "TODO"}], [{status: "TODO", comment: ""}]);
    const meta = lineMeta(getPage(path).blocks[0], path);
    ok(!(meta && meta.textContent.includes("informed::")), "informed:: shown on the line");
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
  test("#159 #285 Got it stamps acknowledged::; done on one you asked is filed as their word and reviewed, not closed", async () => {
    const path = scratchProject("update mail ack", [["DOING", "Quote for [[p/Lars Haugen]]"], ["WAIT", "Contract from [[p/Lars Haugen]]"]]);
    const [a, b] = getPage(path).blocks;
    const ra = V.space + "-" + ensureBlockId(path, a), rb = V.space + "-" + ensureBlockId(path, b);
    setBlockProp(b, ASKED_PROP, "Kenneth Aar " + nowStamp());
    openUpdateArrived(parseUpdateReply("1 done\n2 done\n\n> " + REF_LINE([ra, rb])));
    await settle();
    const [a2, b2] = getPage(path).blocks;
    ok(blockProp(a2, ACK_PROP), "no acknowledged:: on the task you told them about");
    eq(ackedDays(a2), 0);
    eq(a2.state, "DOING", "their done closed your own task");
    eq(b2.state, "WAIT", "their done closed what you asked about without a decision");
    eq(messagesOf(b2).map(m => [m.title, msgAuthor(m)]), [["Done.", "Lars Haugen"]]);
    has($("#modalRoot").textContent, "Contract from", "the review opens on it");
    closeAll();
  });
  test("#159 words with no number go to the task you pick, the only one by itself", async () => {
    const path = scratchProject("update mail loose", [["DOING", "Plan for [[p/Lars Haugen]]"]]);
    const a = getPage(path).blocks[0];
    const ra = V.space + "-" + ensureBlockId(path, a);
    openUpdateArrived(parseUpdateReply("Sounds good, but call me first.\n\nLars\n\n> " + REF_LINE([ra])));
    await settle();
    eq(messagesOf(getPage(path).blocks[0]).map(m => m.title), ["Sounds good, but call me first."]);
    closeAll();
  });
  /* Feedback is reviewed one item at a time and handled only by an outcome on
     the project or to-do it is about (#285). */
  const withFeedbackSince = async fn => {
    const was = lastSeen();
    PREF.set(seenKey(), "2000-01-01T00:00:00Z");
    try { return await fn(); } finally { PREF.set(seenKey(), was); }
  };
  const feedbackOn = path => feedbackQueue().filter(f => f.path === path);
  test("#285 the review queue holds new comments from others, not status events, your own words or handled ones", () => withFeedbackSince(() => {
    const path = scratchProject("feedback queue", [["WAIT", "Contract from [[p/Lars Haugen]]"], ["TODO", "Send the quote"]]);
    const [wait, todo] = getPage(path).blocks;
    postMessageAs(path, wait, "Signed, it is in the post.", "Lars Haugen", nowStamp());
    postMessage(path, wait, "Thanks");
    setBlockState(path, todo, "DONE");
    setBlockProp(todo, "done_by", "Lars Haugen " + nowStamp());
    eq(feedbackOn(path).map(f => [f.who, f.text]), [["Lars Haugen", "Signed, it is in the post."]]);
    ok(decideFeedback(feedbackOn(path)[0], "close"), "an outcome is taken");
    eq(feedbackOn(path).length, 0, "handled feedback leaves the queue");
  }));
  test("#285 a waiting-for or finished line asks about its project, an open to-do about itself", () => withFeedbackSince(() => {
    const path = scratchProject("feedback kinds", [["WAIT", "Answer from [[p/Lars Haugen]]"], ["TODO", "Draft the plan"]]);
    const [wait, todo] = getPage(path).blocks;
    postMessageAs(path, wait, "Not from me, ask Anna.", "Lars Haugen", nowStamp());
    postMessageAs(path, todo, "Use the old one.", "Lars Haugen", nowStamp());
    const [fw, ft] = feedbackOn(path);
    eq(feedbackOutcomes(fw), ["continue", "close", "cancel", "someday"]);
    eq(feedbackSubject(fw).project, path);
    eq(feedbackOutcomes(ft), ["keep", "complete", "cancel", "someday"]);
  }));
  test("#285 Continue needs a next action and records it; Close, Cancel and Someday/Maybe move the project", () => withFeedbackSince(() => {
    const path = scratchProject("feedback continue", [["WAIT", "Status from [[p/Lars Haugen]]"]]);
    const wait = getPage(path).blocks[0];
    setBlockProp(wait, ASKED_PROP, "Kenneth Aar " + nowStamp());
    postMessageAs(path, wait, "Who does this come from?", "Lars Haugen", nowStamp());
    const f = feedbackOn(path)[0];
    ok(!decideFeedback(f, "continue", {next: "  "}), "Continue without a next action is taken");
    eq(feedbackOn(path).length, 1, "and the feedback stays open");
    ok(decideFeedback(f, "continue", {next: "Confirm the source with Lars", due: "2026-12-01"}));
    const next = getPage(path).blocks.find(b => b.title === "Confirm the source with Lars");
    ok(next && next.state === "TODO", "the next action is on the project");
    eq(dueDate(next), "2026-12-01");
    ok(!blockProp(getPage(path).blocks[0], ASKED_PROP), "the question still counts as unanswered");
    const m = messagesOf(getPage(path).blocks[0])[0];
    has(blockProp(m, DECIDED_PROP), "Confirm the source with Lars", "the outcome and change are on record");
    ok(splitStamp(blockProp(m, HANDLED_PROP)).iso, "with who handled it and when");
    const row = activityHere(todayISO()).find(r => r.kind === "said" && r.path === path);
    has(row.decided, "Continue: Confirm the source with Lars", "History shows the outcome");
    for (const [outcome, dir] of [["someday", "2"], ["cancel", "-"], ["close", "0"]]) {
      const p = scratchProject("feedback " + outcome, [["WAIT", "Reply from [[p/Lars Haugen]]"]]);
      postMessageAs(p, getPage(p).blocks[0], "Not now.", "Lars Haugen", nowStamp());
      ok(decideFeedback(feedbackOn(p)[0], outcome), outcome);
      const moved = join(STATUS_DIRS[dir], baseName(p) + ".md");
      ok(getPage(moved), outcome + " moved the project to " + dir);
    }
    closeAll();
  }));
  test("#285 Keep, Complete, Cancel and Someday/Maybe settle a to-do", () => withFeedbackSince(() => {
    const path = scratchProject("feedback todo", [["TODO", "Book the room"], ["TODO", "Print the deck"], ["TODO", "Ask about catering"]]);
    const [keep, done, gone] = getPage(path).blocks;
    for (const b of [keep, done, gone]) postMessageAs(path, b, "Ok?", "Lars Haugen", nowStamp());
    const [fk, fd, fg] = feedbackOn(path);
    ok(decideFeedback(fk, "keep", {next: "Book the big room"}));
    eq([keep.title, keep.state], ["Book the big room", "TODO"]);
    ok(decideFeedback(fd, "complete"));
    eq(done.state, "DONE");
    ok(decideFeedback(fg, "cancel"));
    eq(gone.state, "CANCELLED");
    eq(feedbackOn(path).length, 0);
    closeAll();
  }));
  test("#285 one item at a time; Reply and Edit keep it open at the same place; destructive outcomes ask first", () => withFeedbackSince(async () => {
      const path = scratchProject("feedback review", [["WAIT", "Plan from [[p/Lars Haugen]]"], ["WAIT", "Quote from [[p/Anna Berg]]"]]);
      const other = scratchProject("feedback review venue", [["TODO", "Check the venue"]]);
      const wait = getPage(path).blocks[0], venue = getPage(other).blocks[0];
      postMessageAs(path, wait, "Is this a thing?", "Lars Haugen", nowStamp());
      postMessageAs(other, venue, "It is booked.", "Lars Haugen", nowStamp());
      const items = feedbackOn(path).concat(feedbackOn(other));
      const btn = t => [...document.querySelectorAll("#modalRoot button")].find(x => trim(x.textContent) === t);
      openFeedbackReview(items);
      const root = () => $("#modalRoot").textContent;
      has(root(), "1 of 2"); has(root(), "Lars Haugen"); has(root(), "Is this a thing?");
      has(root(), "No next action", "the project's missing next action shows");
      ok(!btn("Keep") && btn("Continue"), "only the project's outcomes");
      ok(!btn("Done"), "no vague Done");
      btn("Reply").click();
      $("#modalRoot textarea").value = "From the board meeting.";
      btn("Send").click();
      await settle();
      has(root(), "1 of 2", "a reply is not an outcome");
      eq(messagesOf(wait).map(m => m.title), ["Is this a thing?", "From the board meeting."]);
      btn("Edit").click();
      await settle();
      ok(!root().includes("1 of 2"), "Edit opens the item");
      closeModal();
      await settle(); await settle();
      has(root(), "1 of 2", "back on the same feedback after the edit");
      btn("Close").click();
      has(root(), "Close project?", "closing a project with an open task asks first");
      btn("Back").click();
      has(root(), "1 of 2", "Back returns to the item, nothing handled");
      btn("Close").click();
      btn("Close and next").click();
      await settle();
      has(root(), "2 of 2");
      ok(btn("Keep") && btn("Complete") && !btn("Continue"), "only the to-do's outcomes");
      btn("Complete").click();
      await settle();
      has(root(), "caught up");
      closeAll();
  }));
  test("#285 Since you were last here shows the feedback count and Review, not a list", () => withFeedbackSince(() => {
    const path = scratchProject("feedback box", [["TODO", "Tidy the shelf"]]);
    postMessageAs(path, getPage(path).blocks[0], "Which shelf?", "Lars Haugen", nowStamp());
    const n = feedbackQueue().length;
    const box = newsBox();
    ok(box, "the box shows");
    has(box.textContent, "Feedback");
    has(box.textContent, String(n));
    ok(!box.querySelector("li"), "no list of comments");
    ok([...box.querySelectorAll("button")].some(b => trim(b.textContent) === "Review"), "one Review button");
    ok(!box.textContent.includes("Which shelf?"), "the comment itself waits for the review");
  }));
  test("#159 a linked email reads as its subject, without the m/", () => {
    eq(plainTitle("Svar om [[m/Forespørsel om revisjonsrapport – Lager 3]]"), "Svar om Forespørsel om revisjonsrapport – Lager 3");
  });
  test("#159 taking the name out of a question takes its 'fra' too", () => {
    const was = PREF.get("askLang", "");
    PREF.set("askLang", "no");
    try {
      const {ask} = askQuestionParts({title: "Venter på svar fra [[p/Lars Haugen]] om [[m/Forespørsel om revisjonsrapport – Lager 3]]",
        project: "Lager"}, "Lars Haugen");
      eq(ask, "Venter på svar om Forespørsel om revisjonsrapport – Lager 3");
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
  test("#266 the people step finds a person by an alias and offers no new name for it", async () => {
    npmReset();
    const lp = personPath("Lars Haugen");
    getPage(lp).props.aliases = "lhaug"; touch(lp); clearMemo();
    try {
      const path = scratchProject("Alias plan");
      npmOpen(V.space, path);
      NPM.people = [];
      const root = el("div", {}, ...npmPeopleQ());
      const box = root.querySelector(".npmin");
      box.value = "lhaug";
      box.dispatchEvent(new Event("input"));
      const chips = [...root.querySelectorAll(".fchip")].map(c => c.textContent);
      ok(chips.some(t => t.includes("Lars Haugen")), "the alias finds the person");
      ok(!chips.some(t => t.includes("+ New")), "no new person for the alias");
    } finally { delete getPage(lp).props.aliases; touch(lp); clearMemo(); npmReset(); }
  });
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
    has(panel.textContent, "A monthly newsletter goes out");
    has(panel.textContent, "Useful before promotional · One a month");
    has(panel.textContent, "Ask Sofia which field holds consent");
    has(panel.textContent, "1. Mailing list");
    has(panel.textContent, "after 1");
    has(content().querySelector(".pagehead").textContent, "Re-plan");
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
    ok(acts.some(a => a.word === "Re-plan it"), "an answer of its own");
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
  test("#290 Ways to run: what you tick picks the way, and a limit rules a way out", async () => {
    const best = (needs, limits) => runWayPick(needs, limits)[0];
    eq(best([], []).id, "pages", "with nothing ticked, the web address: nothing to install");
    eq(best(["cal"], []).id, "vault", "calendar links need serve.py");
    eq(best(["cal", "noask"], []).id, "vault");
    eq(best(["any"], []).id, "vault", "only the server's folder works in any browser");
    const noPy = best(["cal"], ["nopy"]);
    ok(!["serve", "vault"].includes(noPy.id), "no Python rules serve.py out");
    eq(noPy.missing, ["cal"], "and it says what the pick cannot do");
    eq(best([], ["nopy", "noweb"]).id, "file", "no Python and no web address leaves the file");
    ok(runWayPick([], ["norun"]).every(w => !RUN_WAYS[w.id].run), "a way that must keep running is ruled out");
    helpReset();
    openHelp("run");
    await settle();
    const box = content().querySelector(".helprun");
    ok(box, "the topic has the chooser");
    has(box.querySelector(".runbest").textContent, RUN_WAYS.pages.title);
    const tick = box.querySelector("input[value=cal]");
    tick.checked = true;
    tick.dispatchEvent(new Event("change"));
    has(box.querySelector(".runbest").textContent, RUN_WAYS.vault.title, "ticking calendar links changes the advice");
    eq(box.querySelectorAll("table.runtable tbody tr").length, Object.keys(RUN_WAYS).length, "every way is in the table");
    helpReset();
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
  test("#303 merging a context updates Sense where I am, so it does not come back", () => {
    const keep = ["sense.here", "sense.away", "sense.work", "sense.places", "sense.learn"].map(k => [k, PREF.get(k, "")]);
    makeContext("Testoldpc"); makeContext("Testnewpc");
    try {
      PREF.set("sense.here", "testoldpc");
      PREF.set("sense.away", "Testelsewhere");
      PREF.set("sense.work", JSON.stringify({ctx: "testoldpc", days: [1], from: "08:00", to: "16:00"}));
      PREF.set("sense.places", JSON.stringify([{ctx: "testoldpc", lat: 1, lon: 1, r: 150}]));
      PREF.set("sense.learn", JSON.stringify([{k: "ctx", v: "testoldpc", t: Date.now(), f: null}]));
      mergeContextInto("Testoldpc", "Testnewpc");
      eq(PREF.get("sense.here", ""), "Testnewpc");
      eq(PREF.get("sense.away", ""), "Testelsewhere", "a name that was not merged is left alone");
      eq(JSON.parse(PREF.get("sense.work", "{}")).ctx, "Testnewpc");
      eq(JSON.parse(PREF.get("sense.places", "[]"))[0].ctx, "Testnewpc");
      eq(JSON.parse(PREF.get("sense.learn", "[]"))[0].v, "Testnewpc");
      ok(!getPage(contextPath("Testoldpc")), "not recreated by makeContext");
      eq(makeContext(senseHere()), "Testnewpc", "sensing now would not revive the old name");
    } finally {
      for (const [k, v] of keep) PREF.set(k, v);
      removePage(contextPath("Testoldpc")); removePage(contextPath("Testnewpc"));
      document.querySelectorAll("#toasts .toast").forEach(x => x.remove());
      clearMemo();
    }
  });

  /* ============================================================
     Events, feelings and Reflect: the bullet journal (#185)
     ============================================================ */
  // Day pages n days back with these lines on them, and no intentions, put back afterwards.
  const withWeek = async (days, fn) => {
    const saved = new Map([[INTENTIONS_PATH, null], [journalPath(weekOf(T())), null]].concat(days.map(([n]) => [journalPath(shiftISO(T(), -n)), null])));
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
      const own = getPage(REVIEW_LIST_PATH);
      try {
        putPage(REVIEW_LIST_PATH, parsePage("- Empty the inboxes\n- Read the calendar\n"), {silent: true});
        clearMemo();
        const all = reviewSteps().flatMap(g => g.steps);
        eq(all[all.length - 1], step(), "last in the vault's own list");
        V.pages.delete(REVIEW_LIST_PATH);
        eq(reviewSteps().find(g => g.steps.some(s => s.doors.includes("reflect"))).title, "CREATIVE");
      } finally { if (own) putPage(REVIEW_LIST_PATH, own, {silent: true}); else V.pages.delete(REVIEW_LIST_PATH); clearMemo(); }
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
      const wk = journalPath(weekOf(T()));
      eq(reflectionBlock(false).path, wk, "#217 the line is on the week page");
      has(serializePage(parsePage(serializePage(getPage(wk)))), "#reflection Week", "kept in the file");
      ok(!getPage(today).blocks.some(b => /^#reflection/i.test(b.title || "")), "#217 not on a day page");
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
  test("#177 a page opened from the review card follows the next card, until the pane is closed", async () => {
    const pane = document.querySelector("#pagePane");
    const until = async cond => { for (let i = 0; i < 200 && !cond(); i++) await new Promise(r => setTimeout(r, 10)); };
    const card = () => SOL.order[SOL.i];
    const shows = r => { const s = SIDE_SHOWN; return !pane.hidden && !!s && s.path === r.path && (s.space || "") === (r.space || V.space || ""); };
    const skip = async () => { solOp(card(), "skip"); await until(() => !SOL.moving); await settle(); };
    try {
      go("review", {sub: "projects"}); solGoPass(0); await settle();
      ok(SOL.order && SOL.order.length >= 2, "two cards to review");
      const open = [...content().querySelectorAll(".solcard .textbtn")].find(b => b.textContent === "Open the page");
      ok(open, "no Open the page on the card");
      open.click(); await settle();
      ok(shows(card()), "the card's page is on the right");
      const first = card();
      await skip();
      ok(card() !== first, "a new card is dealt");
      ok(shows(card()), "the pane shows the next card's page");
      closeSidePage(); await settle();
      await skip();
      ok(pane.hidden, "closed, the pane stays closed");
      previewPage(card().space, card().path, true); await settle();
      go("next"); await settle();
      go("review", {sub: "projects"}); await settle();
      await skip();
      ok(!shows(card()), "leaving the review stops the pane following");
    } finally { closeSidePage(); solGoPass(0); }
  });
  test("#216 the last Projects pass hands on to Reflect, or to Steps, and Reflect back to Steps", async () => {
    const onward = async () => {
      go("review", {sub: "projects"}); solGoPass(SD_PASS); await settle();
      return sdOnward().filter(n => n && n.nodeType === 1).pop();
    };
    try {
      await withWeek([], async () => {
        const b = await onward();
        eq(b.textContent, "Steps ›", "nothing to reflect on: back to the steps");
        b.click(); await settle();
        eq(subNow(), "steps");
      });
      await withWeek([[0, "- o Ran 5 km\n"]], async () => {
        const b = await onward();
        eq(b.textContent, "Reflect ›", "an event this week: on to Reflect");
        b.click(); await settle();
        eq(subNow(), "reflect");
        const back = content().querySelector(".review-onward");
        ok(back, "Reflect has no way on");
        eq(back.textContent, "Steps ›");
        back.click(); await settle();
        eq(subNow(), "steps");
      });
    } finally { solGoPass(0); }
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
     The week: a week page and the days under it (#192)
     ============================================================ */
  // Pages put in for one test and taken out after it, whatever happens.
  const withPages = async (pages, fn) => {
    const saved = new Map(Object.keys(pages).map(p => [p, getPage(p) || null]));
    for (const [p, text] of Object.entries(pages)) putPage(p, parsePage(text), {silent: true});
    clearMemo();
    try { await fn(); } finally {
      for (const [p, page] of saved) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
      clearMemo();
    }
  };
  const dated = (b, d, time) => { setDue(b, d, time); return b; };

  /* ============================================================
     The Journal on a phone (#222)
     ============================================================ */
  // The Journal's top, laid out again in a phone-wide frame with the app's own styles.
  const phoneJournal = async (width = 390) => {
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:0;top:0;height:900px;border:0;width:" + width + "px";
    const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("\n");
    const wrap = content().querySelector(".wrap").cloneNode(true);
    f.srcdoc = "<!doctype html><html data-theme=\"" + (document.documentElement.dataset.theme || "") + "\"><style>" + css +
      "</style><body><div id=\"content\">" + wrap.outerHTML + "</div>";
    document.body.append(f);
    await new Promise(r => f.onload = r);
    return {f, d: f.contentDocument};
  };
  test("#222 on a phone the Journal says the day in words, over the date box", async () => {
    PREF.set("today.tab", "due");
    go("today");
    await settle();
    const label = content().querySelector(".todayhead .daypick .daylabel");
    ok(label, "the day in words");
    has(label.textContent, "Today");
    ok(content().querySelector(".todayhead .daypick input[type=date]"), "the date box is under the words");
    const {f, d} = await phoneJournal();
    try {
      const l = d.querySelector(".daylabel"), lr = l.getBoundingClientRect();
      ok(getComputedStyle(l).display !== "none" && lr.width > 40, "the words show: " + Math.round(lr.width) + "px");
      ok(l.scrollWidth <= l.clientWidth + 0.5, "the day is not clipped: " + l.textContent);
      const box = d.querySelector(".daypick input").getBoundingClientRect(), pick = d.querySelector(".daypick").getBoundingClientRect();
      ok(box.width >= pick.width - 1 && box.height >= pick.height - 1, "a tap on the words opens the date box");
      ok(parseFloat(getComputedStyle(d.querySelector(".todayhead h1")).fontSize) <= 20, "the page name is smaller than the day");
      const h = d.querySelector(".todayhead h1").getBoundingClientRect(), db = d.querySelector(".daybox").getBoundingClientRect();
      ok(db.top < h.bottom && db.bottom > h.top && db.left >= h.right, "the day is beside the page name, on its row");
      ok(getComputedStyle(d.querySelector(".todayhead .jmode")).display === "none", "Day and Week are not in the heading");
      ok(d.documentElement.scrollWidth <= 390, "nothing wider than the phone");
    } finally { f.remove(); }
  });
  test("#222 on a phone the Journal's heading is one row, the rest behind ⋯", async () => {
    JOURNAL_MORE_OPEN = false;
    PREF.set("today.tab", "due");
    await journalDue([["TODO", "Send the late thing"]], shiftISO(T(), -1));
    const more = content().querySelector(".todayhead .jmorebtn");
    ok(more, "a ⋯ in the heading");
    ok(more.classList.contains("late"), "late work marks it");
    eq(getComputedStyle(more).display, "none", "a wide screen has no ⋯");
    ok(getComputedStyle(content().querySelector(".ttabs")).display !== "none", "and shows the tabs as before");
    let {f, d} = await phoneJournal();
    try {
      const h = d.querySelector(".todayhead h1").getBoundingClientRect(), m = d.querySelector(".jmorebtn").getBoundingClientRect();
      ok(m.width > 0 && m.top < h.bottom && m.bottom > h.top, "⋯ is on the title's row");
      for (const sel of [".jfoldbar", ".ttabs", ".tpanel"]) {
        const n = d.querySelector(sel);
        ok(!n || !n.getClientRects().length, sel + " is folded away");
      }
      // A news or countdown box may stand between; nothing folded away does.
      const grid = d.querySelector(".jcard").closest(".jgrid");
      let above = grid.previousElementSibling;
      while (above && !above.getClientRects().length) above = above.previousElementSibling;
      ok(grid.getBoundingClientRect().top - above.getBoundingClientRect().bottom < 30, "the day page starts right under what is above it");
      const l = d.querySelector(".daylabel");
      ok(l.scrollWidth <= l.clientWidth + 0.5, "the day still fits beside ⋯: " + l.textContent);
    } finally { f.remove(); }
    more.click(); await settle();
    ok(content().querySelector(".jfold.open"), "⋯ opens it");
    ({f, d} = await phoneJournal());
    try {
      for (const sel of [".jfoldbar .jmode", ".ttab-due", ".tpanel"]) ok(d.querySelector(sel).getClientRects().length, sel + " shows when open");
      ok(d.documentElement.scrollWidth <= 390, "nothing wider than the phone");
    } finally { f.remove(); JOURNAL_MORE_OPEN = false; render(); await settle(); }
  });
  test("#222 on a phone the Journal's buttons say what they are, in words", async () => {
    go("today");
    await settle();
    const icons = [...content().querySelectorAll(".todayicon")];
    ok(icons.length >= 2, "Trackers and History");
    for (const b of icons) {
      ok(/^[A-Za-z]/.test(b.textContent.trim()), "a word, not an icon: " + b.textContent);
      ok(!/\p{Extended_Pictographic}/u.test(b.textContent), "no colour emoji: " + b.textContent);
    }
    ok(icons.some(b => b.textContent === "Trackers") && icons.some(b => b.textContent === "History"), "Trackers and History");
  });
  test("#222 on a phone the Due tab is one line, and still pairs done with open", async () => {
    await journalDue([["TODO", "Send the late thing"]], shiftISO(T(), -1));
    const tab = content().querySelector(".ttab-due");
    has(tab.querySelector(".tshort").textContent, "Due");
    const {f, d} = await phoneJournal();
    try {
      const t = d.querySelector(".ttab-due");
      ok(t.getBoundingClientRect().height <= 40, "one line: " + Math.round(t.getBoundingClientRect().height) + "px");
      const shown = [...t.querySelectorAll("span")].filter(n => getComputedStyle(n).display !== "none").map(n => n.textContent).join("");
      ok(!shown.includes("Today & Late"), "the short name: " + shown);
      ok(/\d+\/\d+/.test(shown), "done of all: " + shown);
      ok(t.querySelector(".pbar") && getComputedStyle(t.querySelector(".pbar")).display !== "none", "with its bar");
      has(shown, "late");
    } finally { f.remove(); }
  });
  test("#222 an empty @context tab goes; the @context chip at the top says it", async () => {
    const was = state.context;
    state.context = "nowhere-at-all";
    try {
      go("today");
      await settle();
      ok(!content().querySelector(".ttab-ctx"), "no empty @context tab");
    } finally { state.context = was; go("today"); await settle(); }
  });
  test("#222 the area over a journal is a quiet eyebrow, not a coloured pill", async () => {
    go("today");
    await settle();
    const sp = content().querySelector(".jcard:not(.trkcol) .jhead .sp");
    ok(sp, "the area is named");
    const cs = getComputedStyle(sp), fg3 = getComputedStyle(document.documentElement).getPropertyValue("--fg3").trim();
    eq(cs.backgroundColor, "rgba(0, 0, 0, 0)", "no fill");
    eq(cs.borderTopWidth, "0px", "no border");
    const probe = el("span", {style: "color:" + fg3});
    document.body.append(probe);
    try { eq(cs.color, getComputedStyle(probe).color, "muted"); } finally { probe.remove(); }
  });
  test("#222 one area on a phone: the card does not say Journal again, and its area is the way to focus", async () => {
    go("today");
    await settle();
    const card = content().querySelector(".jcard:not(.trkcol)");
    if (!card.classList.contains("solo")) return;   // several areas on: each card keeps its title
    const sp = card.querySelector(".jhead .sp");
    eq(sp.getAttribute("role"), "button");
    eq(sp.tabIndex, 0);
    const {f, d} = await phoneJournal();
    try {
      eq(getComputedStyle(d.querySelector(".jcard.solo .jtitle")).display, "none", "the title goes on a phone");
    } finally { f.remove(); }
    sp.click();
    await settle();
    ok(content().querySelector(".crumbz"), "focused on the journal");
    go("today", {jz: null});
    await settle();
  });
  test("#222 a meeting on its day starts with its time, and two at once are marked", async () => {
    const day = "journals/2099_02_03.md";
    await withPages({[day]: "- #meeting Ring the doorbell man\n  time:: 12:00–13:00\n- #meeting Order the food\n  time:: 12:30\n" +
      "- #meeting Later on\n  time:: 15:00\n- #meeting Elsewhere\n  date:: [[2099-02-04]]\n  time:: 12:00\n"}, async () => {
      const box = el("div", {}, pageOutline(day, {leadCtx: true}));
      document.body.append(box);
      try {
        const line = t => [...box.querySelectorAll(".blk>.line")].find(n => n.querySelector(".txt").textContent.includes(t));
        const first = line("doorbell");
        const kids = [...first.children].map(n => n.className.split(" ")[0]);
        ok(kids.indexOf("ltime") >= 0 && kids.indexOf("ltime") < kids.indexOf("txt"), "the time before the words: " + kids.join(","));
        eq(first.querySelector(".ltime").textContent, "12:00–13:00");
        ok(!/🕒/.test(first.querySelector(".props")?.textContent || ""), "the time is not said again in a chip");
        has(first.querySelector(".chip.clash").textContent, "Order the food");
        has(line("Order the food").querySelector(".chip.clash").textContent, "doorbell");
        ok(!line("Later on").querySelector(".chip.clash"), "no clash at 15:00");
        ok(!line("Elsewhere").querySelector(".ltime"), "a meeting dated elsewhere keeps its date chip");
        has(line("Elsewhere").querySelector(".props").textContent, "12:00");
      } finally { box.remove(); }
    });
  });
  test("#222 a #tag is quiet: the teal is the @context's alone", () => {
    const box = el("div", {html: renderInline("#meeting at the [[c/office]]")});
    document.body.append(box);
    try {
      ok(getComputedStyle(box.querySelector(".tag")).color !== getComputedStyle(box.querySelector(".wikilink.ctx")).color,
        "a tag is not the colour of a context");
    } finally { box.remove(); }
  });
  test("#222 the next meeting says its time while more than an hour off, and counts down after", () => {
    const now = Date.now(), m = (start, title) => ({space: V.space, path: "x.md", block: {}, title, start, end: start + 36e5});
    try {
      paintNextMeeting([m(now + 3 * 36e5, "Far off")]);
      ok(/^at \d\d:\d\d$/.test($("#nextMeet .w").textContent), "a time: " + $("#nextMeet .w").textContent);
      paintNextMeeting([m(now + 20 * 6e4, "Soon")]);
      has($("#nextMeet .w").textContent, "in ");
    } finally { paintNextMeeting(); }
  });
  test("#222 on a touch screen the line menu is big enough for a thumb", () => {
    const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("\n");
    ok(/@media \(hover:none\)\{ \.blk>\.line>\.linemenu\{min-width:40px;min-height:32px/.test(css), "a 40×32 target without hover");
  });
  test("#192 a week by its ISO name: its Monday, its days, and a 53rd week", () => {
    eq(weekOf("2026-10-30"), "2026-W44");
    eq(weekMonday("2026-W44"), "2026-10-26");
    eq(weekDays("2026-W44"), ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01"]);
    eq(weekOf("2027-01-01"), "2026-W53", "1 Jan 2027 is in the last week of 2026");
    eq(shiftWeek("2026-W53", 1), "2027-W01");
    eq(weekMonday("2025-W53"), null, "2025 has 52 weeks");
    const range = new Intl.DateTimeFormat(undefined, {day: "numeric", month: "short", year: "numeric"});
    eq(weekRange("2026-W44"), range.formatRange(parseISO("2026-10-26"), parseISO("2026-11-01")));
    ok(!weekRange("2026-W46", false).includes("2026"), "without the year");
  });
  test("#192 a week page lives beside the day pages, and [[2026-W44]] opens the Journal's week", () => {
    const path = journalPath("2003-W10");
    eq(path, join(JOURNALS, journalOwner(), "2003-W10.md"));
    ok(isWeekPath(path) && !isWeekPath(journalPath("2003-03-03")), "a week page, not a day page");
    eq(resolveWikiPath("2003-W10"), path);
    eq(pageRef(path), "2003-W10");
    eq(journalDate(path), "2003-03-03", "it stands for its Monday");
    openLinkTarget("2003-W10");
    eq([state.view, state.sub, state.todayWeek], ["today", "week", "2003-W10"]);
    ok(!V.pages.has(path), "looking at a past week makes no file");
    go("next");
  });
  test("#192 a new week page takes last week's every week lines, unticked, and leaves the rest", async () => {
    const prev = journalPath("2099-W09"), next = journalPath("2099-W10");
    await withPages({[prev]: "- DONE Water the plants every week\n  closed:: [[2099-03-01]]\n" +
        "- DONE Send the report\n- TODO Back up the vault\n  repeat:: weekly\n" +
        "- Home\n  - DOING Wash the car (every week)\n    SCHEDULED:: [[2099-02-27]]\n- TODO Fix the gate every 2 weeks\n"}, async () => {
      try {
        eq(ensureWeek("2099-W10"), next);
        const page = getPage(next);
        eq(page.props.title, "2099-W10");
        eq(page.blocks.map(b => [b.state, b.title]), [["TODO", "Water the plants every week"], ["TODO", "Back up the vault"],
          ["TODO", "Wash the car (every week)"]]);
        ok(!blockProp(page.blocks[0], "closed") && !dueDate(page.blocks[2]), "no done date, no old date");
        eq(blockProp(page.blocks[1], "repeat"), "weekly", "still a routine");
        eq(getPage(prev).blocks[1].state, "DONE", "last week is left as it was");
        eq(ensureWeek("2099-W10"), next);
        eq(getPage(next).blocks.length, 3, "made once");
      } finally { V.pages.delete(next); }
    });
  });
  test("#302 a new week page starts from pages/8/week.md, title filled in, once", async () => {
    const tpl = join(DIRS.lists, "week.md"), next = journalPath("2099-W11");
    await withPages({[tpl]: "# %title%\n\n## Notes\n\nSomething for %title%\n"}, async () => {
      try {
        eq(ensureWeek("2099-W11"), next);
        const page = getPage(next);
        eq(page.blocks[0].title, "# 2099-W11");
        eq(page.blocks[0].body, ["## Notes", "", "Something for 2099-W11"]);
        eq(ensureWeek("2099-W11"), next);
        eq(getPage(next).blocks.length, 1, "the template is not poured twice");
      } finally { V.pages.delete(next); }
    });
  });
  test("#302 a missing or empty week template leaves a new week page as before", async () => {
    const next = journalPath("2099-W12");
    try {
      eq(ensureWeek("2099-W12"), next);
      eq(getPage(next).blocks.length, 0, "nothing poured in with no template");
    } finally { V.pages.delete(next); }
  });
  test("#192 ticking a weekly routine on a week page asks for no next one", async () => {
    const path = journalPath("2099-W20");
    await withPages({[path]: "- TODO Back up the vault\n  repeat:: weekly\n"}, async () => {
      setBlockState(path, getPage(path).blocks[0], "DONE");
      await settle();
      eq(getPage(path).blocks.length, 1, "no copy made");
      ok(!document.querySelector(".modal"), "no question asked");
    });
  });
  test("#192 a task on a week page is a next action, dated from its Monday", async () => {
    const id = weekOf(T()), path = journalPath(id);
    await withPages({[path]: "- TODO Book next week's site visits [[c/phone]]\n"}, () => {
      const a = myOpen().find(x => x.path === path);
      ok(a, "on the lists");
      eq(a.added, weekMonday(id));
      eq(a.context, "phone");
    });
  });
  test("#192 the week: its page, then seven days with only what is dated, a word only when out of the ordinary", async () => {
    const id = shiftWeek(weekOf(T()), -1), [mon, tue, wed, thu] = weekDays(id);
    const path = scratchProject("week", [["TODO", "Reply to the parking email [[c/computer]]"], ["TODO", "Clean the gutters"],
      ["WAIT", "Quote from Havbris Seafood"], ["TODO", "Send the depot guide"], ["DONE", "Send minutes to the board"]]);
    const [late, span, wait, timed, done] = getPage(path).blocks;
    dated(late, mon); dated(wait, wed); dated(timed, wed, "15:00"); dated(done, tue);
    span.props.SCHEDULED = "[[" + tue + "]]"; span.props.DEADLINE = "[[" + thu + "]]";
    const day = journalPath(wed);
    await withPages({[day]: "- #meeting Dentist\n  time:: 14:00\n"}, async () => {
      try {
        go("today", {sub: "week", todayWeek: id});
        await settle();
        eq(content().querySelector(".todayhead h1").textContent, id);
        has(content().querySelector(".todayhead .sub").textContent, "late");
        ok(content().querySelector(".wkcard"), "the week page");
        const days = [...content().querySelectorAll(".wkday")];
        eq(days.length, 7);
        const words = d => [...days[weekDays(id).indexOf(d)].querySelectorAll(".wkitem")]
          .map(n => [n.querySelector(".wktext").textContent.trim(), (n.querySelector(".wksub") || {}).textContent || ""]);
        const daysLate = n => "! " + dateDiffDays(n, T()) + "d late";
        eq(words(mon).find(w => /parking/.test(w[0])), ["@computer Reply to the parking email", daysLate(mon)]);
        eq(words(tue).filter(w => /gutters|minutes/.test(w[0])), [["Send minutes to the board", ""], ["Clean the gutters", "starts"]]);
        eq(words(wed).filter(w => /Dentist|depot|Havbris/.test(w[0])),
          [["14:00 Dentist", ""], ["Send the depot guide", daysLate(wed)], ["Quote from Havbris Seafood", "waiting"]]);
        eq(words(thu).find(w => /gutters/.test(w[0])), ["Clean the gutters", daysLate(thu)]);
        const tick = [...days[1].querySelectorAll(".wkitem")].find(n => /minutes/.test(n.textContent)).querySelector(".tick");
        tick.click();
        eq(done.state, "TODO", "ticked again in place");
      } finally { V.pages.delete(path); clearMemo(); }
    });
  });
  test("#192 Day and Week: the week of the day, and back to today or the week's Monday", async () => {
    const past = shiftISO(T(), -21), id = weekOf(past);
    go("today", {sub: null, todayDay: past});
    await settle();
    content().querySelector(".jmode button:nth-child(2)").click();
    eq([state.sub, state.todayWeek], ["week", id]);
    content().querySelector(".jmode button:first-child").click();
    eq([state.sub, state.todayDay], [null, weekMonday(id)]);
    go("today", {sub: "week", todayWeek: null});
    await settle();
    content().querySelector(".jmode button:first-child").click();
    eq([state.sub, state.todayDay], [null, null], "this week's Day is today");
  });
  test("#192 the arrows step a week, and Today comes back to this week", async () => {
    const now = weekOf(T());
    go("today", {sub: "week", todayWeek: null});
    await settle();
    content().querySelector(".weeknav .dayarrow:last-child").click();
    eq(state.todayWeek, shiftWeek(now, 1));
    content().querySelector(".weeknav .dayarrow:first-child").click();
    content().querySelector(".weeknav .dayarrow:first-child").click();
    eq(state.todayWeek, shiftWeek(now, -1));
    content().querySelector(".weeknav .wkjump").click();
    eq(state.todayWeek, null);
    eq(content().querySelector(".todayhead h1").textContent, now);
    content().querySelectorAll(".wkdayhead")[0].click();
    eq([state.sub, state.todayDay], [null, weekMonday(now) === T() ? null : weekMonday(now)], "a day's name opens the day");
  });
  test("#211 the week and the lists use a wide screen, and Content width can keep them narrow", async () => {
    const was = PREF.get("style.width", "wide");
    try {
      PREF.set("style.width", "wide"); applyStyles();
      eq(document.documentElement.dataset.width, "wide");
      go("today", {sub: "week", todayWeek: null});
      await settle();
      const wk = content().querySelector(".wrap");
      ok(wk.classList.contains("jweek"), "the week is wide with one space too");
      const wide = innerWidth >= 1100;
      if (wide) ok(wk.getBoundingClientRect().width > 820, "the week is wider than the reading column, got " + wk.getBoundingClientRect().width);
      const txt = content().querySelector(".wkgrid .wktext");
      if (wide && txt) eq(getComputedStyle(txt).webkitLineClamp, "8", "a task in a day wraps rather than ends in ...");
      for (const [view, sub] of [["next", "list"], ["waiting", "list"], ["people", "list"], ["orgs", "list"], ["projects", "list"]]) {
        go(view, {sub});
        await settle();
        ok(content().querySelector(".wrap").classList.contains("lwide"), view + " list spreads on a wide screen");
      }
      go("pages", {sub: "list"});
      await settle();
      ok(!content().querySelector(".wrap.lwide"), "pages keep their line length");
      PREF.set("style.width", "narrow"); applyStyles();
      go("today", {sub: "week", todayWeek: null});
      await settle();
      if (wide) ok(content().querySelector(".wrap").getBoundingClientRect().width <= 820, "Narrow keeps the reading column");
      go("checklists");
      await settle();
      eq(content().querySelector(".stylewidth").value, "narrow", "Settings shows the width picked");
    } finally {
      PREF.set("style.width", was); applyStyles();
      go("today", {sub: null, todayWeek: null});
      await settle();
    }
  });
  test("#192 the review's calendar step goes to the weeks on the review page, also in a list written before it", async () => {
    const step = () => reviewSteps().flatMap(g => g.steps).find(s => /^Calendar/.test(s.text));
    const had = V.pages.has(REVIEW_LIST_PATH) ? getPage(REVIEW_LIST_PATH) : null;
    V.pages.delete(REVIEW_LIST_PATH);
    clearMemo();
    eq(step().doors, ["weeks", "agenda"], "the list the app starts with");
    putPage(REVIEW_LIST_PATH, parsePage("- CURRENT\n  - Calendar two weeks back and four weeks forward [[go/agenda]]\n"), {silent: true});
    try {
      eq(step().doors, ["weeks", "agenda"], "an older list");
      go("review", {sub: "steps"});
      await settle();
      const row = [...content().querySelectorAll(".rstep")].find(n => /Calendar/.test(n.textContent));
      row.click();
      await settle();
      eq([state.view, state.sub], ["review", "steps"]);
      ok(content().querySelector("#rsec-weeks .wkgrid"), "the weeks are on the review page");
    } finally { if (had) putPage(REVIEW_LIST_PATH, had, {silent: true}); else V.pages.delete(REVIEW_LIST_PATH); clearMemo(); }
  });
  test("#192 the weekly review page: what is left from past weeks, oldest first, then this week and the two after, in Get current (#95)", async () => {
    const old = shiftWeek(weekOf(T()), -3), path = journalPath(old);
    const ahead = [0, 1, 2].map(n => journalPath(shiftWeek(weekOf(T()), n))).filter(p => !V.pages.has(p));
    const proj = scratchProject("review weeks", [["TODO", "Reply to the parking email"]]);
    dated(getPage(proj).blocks[0], shiftISO(T(), -2));
    await withPages({[path]: "- TODO Send board tax receipts\n- DONE Water the plants every week\n"}, async () => {
      try {
        go("review", {sub: "steps"});
        await settle();
        // David Allen's order: the calendar is looked at in get current, after the action lists (#95).
        const weeks = content().querySelector("#rsec-weeks");
        has(weeks && weeks.closest(".rphase").querySelector("summary").textContent, "Get current", "the weeks are in get current");
        ok(!SUBS.review.some(s => s[0] === "weeks"), "no tab of their own");
        const rows = [...content().querySelectorAll(".card > .wkitem")].map(n => n.textContent);
        const at = t => rows.findIndex(r => r.includes(t));
        ok(at("Send board tax receipts") >= 0 && at("Reply to the parking email") > at("Send board tax receipts"), "oldest first: " + rows.join(" | "));
        ok(at("Water the plants") < 0, "done is not left over");
        has(rows[at("Send board tax receipts")], old + " ↗");
        has(rows[at("Reply to the parking email")], "! 2d late");
        const tabs = [...content().querySelectorAll(".wkseg button")];
        eq(tabs.length, 3);
        has(tabs[1].textContent, "W" + weekNo(shiftWeek(weekOf(T()), 1)));
        tabs[1].click();
        await settle();
        ok(V.pages.has(journalPath(shiftWeek(weekOf(T()), 1))), "next week's page is there to plan in");
        eq(content().querySelectorAll(".wkday").length, 7);
      } finally {
        REVIEW_WEEK = 0;
        V.pages.delete(proj);
        for (const p of ahead) V.pages.delete(p);
        clearMemo();
      }
    });
  });

  /* ============================================================
     Next on a phone (#224)
     ============================================================ */
  test("#224 on a phone Next's heading is one row: Next, Filter ▾, List ▾", async () => {
    go("next", {sub: "list"});
    await settle();
    ok(!content().querySelector(".vhead .sub"), "no line beside the title");
    ok(content().querySelector(".vhead .csvbtn"), "a wide screen keeps ⤓ in the heading");
    const {f, d} = await phoneJournal();
    try {
      const h = d.querySelector(".vhead h1").getBoundingClientRect(), sw = d.querySelector(".vhead .vsel").getBoundingClientRect();
      eq(getComputedStyle(d.querySelector(".vhead .csvbtn")).display, "none", "no ⤓ in the heading on a phone");
      ok(sw.width > 0 && sw.top < h.bottom && sw.bottom > h.top, "List ▾ is on the title's row, look-alikes or not");
      const fb = d.querySelector(".vhead .nfiltbtn").getBoundingClientRect();
      ok(Math.abs(fb.top + fb.height / 2 - (sw.top + sw.height / 2)) < 6, "Filter ▾ and List ▾ share one line");
      if (d.querySelector(".ntwins")) ok(getComputedStyle(d.querySelector(".vhead .twinbtn")).display === "none" && getComputedStyle(d.querySelector(".nfiltbtn"), "::after").content.includes("⚠"), "look-alikes wait behind Filter");
      ok(d.documentElement.scrollWidth <= 390, "nothing wider than the phone");
    } finally { f.remove(); }
  });
  test("#224 on a phone Next's filters fold behind Filter, which counts what is filtered", async () => {
    const wasHidden = PREF.get("hideStates:" + (Spaces.active || ""), "[]");
    NEXT_FILTERS_OPEN = false;
    try {
      setHiddenStates(new Set());
      go("next", {sub: "list", ctxFilter: null}); await settle();
      const btn = content().querySelector(".vhead .nfiltbtn");
      ok(btn, "a Filter button in the heading");
      ok(!/\d/.test(btn.textContent), "nothing filtered, no number: " + btn.textContent);
      let {f, d} = await phoneJournal();
      try {
        eq(getComputedStyle(d.querySelector(".nfold")).display, "none", "the filters are folded on a phone");
        ok(getComputedStyle(d.querySelector(".nfiltbtn")).display !== "none", "Filter shows on a phone");
        ok(d.querySelector(".task").getBoundingClientRect().top - d.querySelector(".vhead").getBoundingClientRect().bottom < 40,
          "the list starts right under the heading");
      } finally { f.remove(); }
      eq(getComputedStyle(content().querySelector(".nfiltbtn")).display, "none", "a wide screen has no Filter button");
      ok(getComputedStyle(content().querySelector(".fbar")).display !== "none", "and shows the filters as before");
      setHiddenStates(new Set(["DOING"]));
      render(); await settle();
      has(content().querySelector(".nfiltbtn").textContent, "1", "one state hidden counts");
      ok(content().querySelector(".nfiltbtn").classList.contains("on"), "and stands out");
      content().querySelector(".nfiltbtn").click(); await settle();
      ok(content().querySelector(".nfold.open"), "Filter opens them");
      ({f, d} = await phoneJournal());
      try { ok(getComputedStyle(d.querySelector(".nfold")).display !== "none", "open on a phone too"); } finally { f.remove(); }
    } finally {
      NEXT_FILTERS_OPEN = false;
      PREF.set("hideStates:" + (Spaces.active || ""), wasHidden); render();
    }
  });
  test("#224 on a phone a Next row is a round tick, its @context before the words, and one quiet line", async () => {
    go("next", {sub: "list", ctxFilter: null}); await settle();
    const {f, d} = await phoneJournal();
    try {
      const row = [...d.querySelectorAll(".task")].find(r => r.querySelector(".nlead") && r.querySelector(".duepill"));
      ok(row, "a row with a context and a day");
      const tick = row.querySelector(".tick"), tr = tick.getBoundingClientRect();
      ok(Math.abs(tr.width - tr.height) < 1 && tr.width <= 24, "the tick is a round button: " + tr.width + "x" + tr.height);
      eq(getComputedStyle(row.querySelector(".t-menu")).display, "none", "no ⋯ on a phone");
      const lead = row.querySelector(".nlead");
      eq(lead.parentElement, row.querySelector(".t-title"), "the @context is in the words' line");
      eq(row.querySelector(".t-title").firstElementChild, lead, "before the words");
      eq(getComputedStyle(row.querySelector(".t-body .chip.ctx")).display, "none", "and not said twice");
      ok(getComputedStyle(row.querySelector(".duepill"), "::before").content.includes("Due"), "a day says it is when it is due");
      eq(getComputedStyle(row.querySelector(".duepill")).backgroundColor, "rgba(0, 0, 0, 0)", "a quiet line, not pills");
      ok(tick.getBoundingClientRect().right + 20 > row.querySelector(".t-title").getBoundingClientRect().left, "the words start right after the tick");
      ok(d.documentElement.scrollWidth <= 390, "nothing wider than the phone");
    } finally { f.remove(); }
    eq(getComputedStyle(content().querySelector(".task .nlead")).display, "none", "a wide screen keeps the pills");
  });
  test("#225 on a phone Next is To do or Chores: chores before and after work and on days off, each with a count", async () => {
    const path = choreProject("next sides", [chore("Dust the side shelf [[c/home/kitchen]]", "daily", -1),
      stampAuthor(newBlock({state: "TODO", title: "Write the side report"}))]);
    const was = Object.getOwnPropertyDescriptor(PHONE, "matches"), side = PREF.get("next.side", ""), wh = PREF.get("work_hours", "");
    const learnt = PREF.get("sense.learn", "[]"); PREF.set("sense.learn", "[]");
    const at = (d, h, m = 0) => { const x = new Date(2026, 10, d, h, m); return x; };   // 2 Nov 2026 is a Monday
    try {
      ok(!choreTime(at(2, 10)), "Monday 10:00 is work");
      ok(choreTime(at(2, 7, 30)) && choreTime(at(2, 16)) && choreTime(at(2, 21)), "before 8 and from 16 is chore time");
      ok(choreTime(at(7, 10)) && choreTime(at(8, 10)), "Saturday and Sunday are chore time");
      ok(choreSlot(at(2, 7)) !== choreSlot(at(2, 18)), "before and after work are two stretches");
      PREF.set("next.side", ""); setNextSide("todo");
      go("next", {sub: "list", ctxFilter: null}); await settle();
      ok(!content().querySelector(".nside"), "a wide screen has no sides");
      ok(content().querySelector(".fbar .fchip") && [...content().querySelectorAll(".fchip")].some(c => c.textContent.startsWith("Chores")), "but the Chores chip");
      Object.defineProperty(PHONE, "matches", {value: true, configurable: true});
      render(); await settle();
      const box = content().querySelector(".nside");
      ok(box, "a phone has To do and Chores");
      ok(![...content().querySelectorAll(".nfold .fchip")].some(c => c.textContent.startsWith("Chores")), "and no Chores chip as well");
      const [todo, chores] = box.querySelectorAll(".nsidebtn");
      eq(todo.getAttribute("aria-pressed"), "true", "the pick holds");
      const titles = () => [...content().querySelectorAll(".task .t-title")].map(n => n.textContent);
      ok(titles().length && !titles().some(t => t.includes("Dust the side shelf")), "To do has no chores");
      const n = b => +b.querySelector(".nbadge").textContent;
      ok(n(todo) >= titles().length && n(todo) > 0, "To do counts what it holds");
      ok(n(chores) >= 1, "Chores counts its own");
      chores.click(); await settle();
      ok(titles().some(t => t.includes("Dust the side shelf")) && !titles().some(t => t.includes("Write the side report")), "Chores has only chores");
      ok(titles().length <= n(content().querySelector(".nsidebtn[aria-pressed=true]")), "and counts them");
      PREF.set("next.side", JSON.stringify({slot: "2000-01-01:work", side: "todo"}));
      eq(nextSide(at(7, 10)), "chores", "an old pick lapses: Saturday is chores");
      eq(nextSide(at(2, 10)), "todo", "and Monday at 10 to-dos");
    } finally {
      delete PHONE.matches; if (was) Object.defineProperty(PHONE, "matches", was);
      PREF.set("next.side", side); PREF.set("work_hours", wh); PREF.set("sense.learn", learnt);
      dropChores(path); render();
    }
  });
  test("#226 the context is learnt from what you pick: the hour, the day, the place", () => {
    const learnt = PREF.get("sense.learn", "[]");
    const at = (d, h, m = 0) => new Date(2026, 10, d, h, m);   // 2 Nov 2026 is a Monday
    const f = (now, more = {}) => Object.assign(senseFeatures(now, null), more);
    try {
      PREF.set("sense.learn", "[]");
      eq(senseLearned("ctx", at(9, 18), f(at(9, 18))), null, "nothing learnt, no guess");
      senseLearn("ctx", "gym", at(2, 18), f(at(2, 18)));
      eq(senseLearned("ctx", at(9, 18), f(at(9, 18))), null, "one pick is not sure enough");
      senseLearn("ctx", "gym", at(2, 18, 1), f(at(2, 18, 1)));
      eq(senseLog().length, 1, "two picks a minute apart are one");
      senseLearn("ctx", "gym", at(3, 18), f(at(3, 18)));
      senseLearn("ctx", "gym", at(4, 18, 30), f(at(4, 18, 30)));
      eq(senseLearned("ctx", at(9, 18), f(at(9, 18)))?.v, "gym", "weekday evenings: @gym");
      eq(senseLearned("ctx", at(10, 7), f(at(10, 7))), null, "not at seven in the morning");
      senseLearn("ctx", "garden", at(7, 11), f(at(7, 11)));
      senseLearn("ctx", "garden", at(8, 11), f(at(8, 11)));
      eq(senseLearned("ctx", at(14, 11), f(at(14, 11)))?.v, "garden", "weekend mornings: @garden");
      // A place is the strongest clue.
      PREF.set("sense.learn", "[]");
      for (const d of [2, 3, 4]) senseLearn("ctx", "office", at(d, 10), f(at(d, 10), {place: "1,1"}));
      for (const d of [5, 6]) senseLearn("ctx", "cafe", at(d, 10), f(at(d, 10), {place: "2,2"}));
      eq(senseLearned("ctx", at(9, 10), f(at(9, 10), {place: "2,2"}))?.v, "cafe", "at the café's square: @cafe");
      eq(senseLearned("ctx", at(9, 10), f(at(9, 10), {place: "1,1"}))?.v, "office", "at the office's: @office");
      eq(guessContext({device: "phone", net: "", pos: null, places: [], here: "home", away: "", learned: "gym"}).ctx, "gym",
        "a learnt context beats the device's usual one");
      // To do or Chores is learnt the same way.
      PREF.set("sense.learn", "[]");
      for (const d of [2, 3, 4]) senseLearn("side", "todo", at(d, 19), f(at(d, 19)));
      eq(senseLearned("side", at(9, 19), f(at(9, 19)))?.v, "todo", "to-dos on weekday evenings, if that is what you pick");
    } finally { PREF.set("sense.learn", learnt); }
  });
  test("#226 on a phone Next shows the guessed context, and Show all puts it away for the hour", async () => {
    const path = scratchProject("guess ctx");
    getPage(path).blocks = [stampAuthor(newBlock({state: "TODO", title: "Lift the test weights [[c/testgym]]"})),
      stampAuthor(newBlock({state: "TODO", title: "Read the test paper"}))];
    touch(path); clearMemo();
    const was = Object.getOwnPropertyDescriptor(PHONE, "matches"), learnt = PREF.get("sense.learn", "[]");
    try {
      PREF.set("sense.learn", "[]"); NEXT_GUESS_OFF = "";
      const now = Date.now();
      for (const days of [7, 14, 21]) senseLearn("ctx", "testgym", new Date(now - days * 864e5));
      Object.defineProperty(PHONE, "matches", {value: true, configurable: true});
      PREF.set("next.side", JSON.stringify({slot: choreSlot(), side: "todo"}));
      go("next", {sub: "list", ctxFilter: null}); await settle();
      const bar = content().querySelector(".nguess");
      ok(bar, "a guessed context");
      has(bar.textContent, "testgym");
      const titles = () => [...content().querySelectorAll(".task .t-title")].map(n => n.textContent);
      ok(titles().some(t => t.includes("Lift the test weights")) && !titles().some(t => t.includes("Read the test paper")), "only what fits it");
      [...bar.querySelectorAll("button")].find(b => b.textContent === "Show all").click(); await settle();
      ok(!content().querySelector(".nguess"), "Show all puts it away");
      eq(senseLog().at(-1).v, "*", "and is learnt");
      Object.defineProperty(PHONE, "matches", {value: false, configurable: true});
      NEXT_GUESS_OFF = ""; render(); await settle();
      ok(!content().querySelector(".nguess"), "a wide screen shows everything, as before");
    } finally {
      delete PHONE.matches; if (was) Object.defineProperty(PHONE, "matches", was);
      PREF.set("sense.learn", learnt); PREF.set("next.side", ""); NEXT_GUESS_OFF = "";
      getPage(path).blocks = []; touch(path); clearMemo(); render();
    }
  });
  test("#227 a folder a sync app keeps (Syncthing) is not nagged to send or bring in a file", () => {
    const backend = V.backend, said = PREF.get("sync.carried", ""), key = "import.day." + (Spaces.active || ""), imp = PREF.get(key, "");
    try {
      PREF.set("sync.carried", "");
      V.backend = Object.assign({}, backend, {kind: "idb"});
      ok(!carriedBySync(), "browser storage carries nothing by itself");
      for (const kind of ["fs", "http"]) {
        V.backend = Object.assign({}, backend, {kind});
        ok(!phoneLike(), kind + ": a phone on it has no file to send");
        PREF.set(key, "");
        ok(carriedBySync(), kind + ": never a file brought in, so the folder syncs");
        PREF.set(key, shiftISO(todayISO(), -3));
        ok(!carriedBySync(), kind + ": a file brought in this week is still how work moves");
        PREF.set("sync.carried", "1");
        ok(carriedBySync(), kind + ": said so, it is so");
        PREF.set("sync.carried", "");
      }
    } finally { V.backend = backend; PREF.set("sync.carried", said); PREF.set(key, imp); }
  });
  test("#224 on a phone ⤓ is in the area menu, and saves what the view shows", async () => {
    go("next", {sub: "list"});
    await settle();
    const csv = content().querySelector(".vhead .csvbtn");
    const was = Object.getOwnPropertyDescriptor(PHONE, "matches"), click = csv.click;
    let clicked = 0;
    Object.defineProperty(PHONE, "matches", {value: true, configurable: true});
    csv.click = () => clicked++;
    try {
      openSpacesMenu();
      const row = $("#spop .spcsv");
      ok(row, "a ⤓ row in the area menu");
      has(row.textContent, "Export to Excel");
      row.click();
      eq(clicked, 1, "the row runs the view's own ⤓");
      ok($("#spop").hidden, "and closes the menu");
      Object.defineProperty(PHONE, "matches", {value: false, configurable: true});
      openSpacesMenu();
      ok(!$("#spop .spcsv"), "not in the menu where the heading has ⤓");
      go("today"); await settle();
      Object.defineProperty(PHONE, "matches", {value: true, configurable: true});
      openSpacesMenu();
      ok(!$("#spop .spcsv"), "a view with no ⤓ adds no row");
    } finally {
      delete PHONE.matches; if (was) Object.defineProperty(PHONE, "matches", was);
      csv.click = click; closeSpacesMenu();
    }
  });

  /* ============================================================
     Clarify: the day pages' loose lines, one at a time (#95)
     ============================================================ */
  // Day pages n days back with these lines; every other day put aside, and the deck fresh.
  const withDays = async (days, fn) => {
    const mine = days.map(([n]) => journalPath(shiftISO(T(), -n)));
    const others = daysToClarify().filter(p => !mine.includes(p));
    const keep = [PREF.get("clarify.dealt", ""), CL];
    try {
      for (const p of others) getPage(p).props.clarified = "test";
      PREF.set("clarify.dealt", "");
      CL = {pending: null, skip: new Set(), undo: null, aim: 0};
      await withPages(Object.fromEntries(days.map(([n, text]) => [journalPath(shiftISO(T(), -n)), text])), fn);
    } finally {
      for (const p of others) if (getPage(p)) delete getPage(p).props.clarified;
      PREF.set("clarify.dealt", keep[0]);
      CL = keep[1];
      clearMemo();
      go("today");
    }
  };
  const showClarify = async () => { go("review", {sub: "days"}); await settle(); return content(); };
  const press = k => document.body.dispatchEvent(new KeyboardEvent("keydown", {key: k, bubbles: true}));
  test("#95 Clarify deals one loose line at a time, oldest day first, and says what each answer writes", async () => {
    await withDays([[3, "- Call the plumber\n- o Ran 5 km\n- Meeting notes\n  - Ask Kari about the budget\n"],
      [1, "- TODO Already a task\n- Plan the summer party\n"]], async () => {
      const d3 = journalPath(shiftISO(T(), -3));
      eq(clarifyDeck().map(r => plainTitle(r.block.title)),
        ["Call the plumber", "Meeting notes", "Ask Kari about the budget", "Plan the summer party"]);
      let c = await showClarify();
      eq(c.querySelectorAll(".clcard").length, 1, "one line on the table");
      eq(c.querySelector(".clcard h3").textContent, "Call the plumber");
      eq(c.querySelectorAll(".clgroup").length, 3, "to do, not now, nothing to do");
      eq([...c.querySelectorAll(".clans b")].map(n => n.textContent), CL_ANSWERS.map(a => a.label));
      has(c.querySelector(".clhow").textContent, "Ctrl+Enter", "the answer teaches its key");
      c.querySelector(".clans").click();
      eq(getPage(d3).blocks[0].state, "TODO", "To do");
      c = await showClarify();
      eq(c.querySelector(".clcard h3").textContent, "Meeting notes");
      c.querySelectorAll(".clans")[6].click();
      c = await showClarify();
      ok(!getPage(d3).blocks[2].state, "left as a note");
      eq(c.querySelector(".clcard h3").textContent, "Ask Kari about the budget");
      has(c.querySelector(".cleye").textContent, "Meeting notes", "says what it is written under");
      press("d");
      ok(content().querySelectorAll(".clans")[5].classList.contains("on"), "a letter aims at Done already");
      press("Enter");
      await settle();
      eq(getPage(d3).blocks[2].children[0].state, "DONE");
      ok(getPage(d3).props.clarified, "the day is stamped when each line on it has an answer");
      eq(content().querySelector(".clcard h3").textContent, "Plan the summer party", "on to the next day");
      press("Backspace");
      await settle();
      ok(!getPage(d3).blocks[2].children[0].state, "Backspace takes the answer back");
      ok(!getPage(d3).props.clarified, "and the day is open again");
      eq(content().querySelector(".clcard h3").textContent, "Ask Kari about the budget");
    });
  });
  test("#95 Someday/maybe is Alt+2 on the line: a project on that shelf, linked from it", async () => {
    await withDays([[2, "- Learn to sail\n"]], async () => {
      const day = journalPath(shiftISO(T(), -2)), proj = join(DIRS.someday, slugify("Learn to sail") + ".md");
      try {
        (await showClarify()).querySelectorAll(".clans")[3].click();
        await settle();
        ok(V.pages.has(proj), "a someday/maybe project");
        has(getPage(day).blocks[0].title, "[[2/");
        ok(getPage(day).props.clarified, "nothing left on the day");
        has(content().textContent, "Every loose line", "and nothing left to clarify");
      } finally { V.pages.delete(proj); }
    });
  });
  test("#95 a project made from a line is offered the line's words as its name", async () => {
    await withDays([[2, "- Plan the summer party\n"]], async () => {
      const day = journalPath(shiftISO(T(), -2)), block = getPage(day).blocks[0];
      try {
        (await showClarify()).querySelectorAll(".clans")[2].click();
        await settle();
        has(document.querySelector("#modalRoot").textContent, "“Plan the summer party”", "Clarify's Project offers the line first");
        closeModal();
        openRefile(day, block);
        await settle();
        [...document.querySelectorAll("#modalRoot button")].find(b => b.textContent === "+ new project").click();
        await settle();
        eq(document.querySelector("#modalRoot input").value, "Plan the summer party", "refile's + new project");
      } finally { closeModal(); CL.pending = null; }
    });
  });
  test("#278 refile lists the pages the line links to first, in line order, the first one chosen", async () => {
    const a = join(DIRS.active, "Refile linked A.md"), b = join(DIRS.active, "Refile linked B.md");
    const day = journalPath(shiftISO(T(), -2));
    await withPages({[a]: "# Refile linked A\n", [b]: "# Refile linked B\n",
      [day]: "- TODO Call [[Refile linked B]] then [[Refile linked A]], [[Refile linked B]] and [[Nobody here]]\n- TODO No links\n"}, async () => {
      const [one, none] = getPage(day).blocks;
      try {
        eq(refileLinked(day, one), [b, a], "linked targets, in line order, once each");
        eq(refileLinked(day, none), [], "no links: as before");
        openRefile(day, one);
        await settle();
        const rows = [...document.querySelectorAll("#modalRoot button.pick")];
        has(rows[0].textContent, "Refile linked B"); has(rows[0].textContent, "linked");
        has(rows[1].textContent, "Refile linked A"); has(rows[1].textContent, "linked");
        eq(rows.filter(r => r.textContent.includes("Refile linked B")).length, 1, "listed once");
        ok(rows[0].classList.contains("on"), "the first link is chosen");
      } finally { closeModal(); }
    });
  });
  test("#95 the review's tabs follow its steps, and only the step you are on says what it means", async () => {
    eq(SUBS.review.map(s => s[0]), ["steps", "days", "actions", "projects", "reflect"]);
    eq(SUBS.review[1][1], "Clarify");
    go("review", {sub: "steps"});
    await settle();
    const notes = [...content().querySelectorAll(".rstep .rnote")];
    ok(notes.length <= 1 && notes.every(n => n.closest(".rstep.now")), "a note on a step you are not on");
    ok(content().querySelectorAll(".rstep.now").length <= 1, "one step at a time");
    eq(content().querySelectorAll(".rstep:not(.now) .textbtn").length, 0, "buttons on a step you are not on");
    go("today");
  });
  test("#95 the review follows David Allen: get clear, get current, get creative, each with its lists", async () => {
    const had = V.pages.has(REVIEW_LIST_PATH) ? getPage(REVIEW_LIST_PATH) : null;
    try {
      putPage(REVIEW_LIST_PATH, {props: {title: "Weekly review"}, blocks: OLD_STARTER_STEPS.map(t => newBlock({title: t}))}, {silent: true});
      clearMemo();
      ok(!ownReviewList(), "the old starter list is read as somebody's own");
      eq(reviewSteps().map(g => g.title), ["CLEAR", "CURRENT", "CREATIVE"]);
      go("review", {sub: "steps"});
      await settle();
      eq([...content().querySelectorAll(".rphase > summary")].map(s => s.firstChild.textContent), ["Get clear", "Get current", "Get creative"]);
      const fold = t => [...content().querySelectorAll(".rgroup")].find(f => f.querySelector("summary").textContent.startsWith(t));
      const part = t => fold(t)?.parentElement.closest(".rphase")?.querySelector("summary").firstChild.textContent;
      for (const [t, p] of [["Journal actions", "Get clear"], ["Actions without", "Get current"], ["Waiting for", "Get current"],
        ["Someday / maybe", "Get creative"]]) if (fold(t)) eq(part(t), p, t);
      eq(content().querySelectorAll(".wrap > p.hint").length, 0, "a line left open between the folds");
      getPage(REVIEW_LIST_PATH).blocks[0].title = "Empty the inboxes";
      clearMemo();
      ok(ownReviewList(), "a changed list is not somebody's own");
    } finally {
      if (had) putPage(REVIEW_LIST_PATH, had, {silent: true}); else V.pages.delete(REVIEW_LIST_PATH);
      clearMemo();
      go("today");
    }
  });
  test("#95 every headline of the review folds, all folded until you open one", async () => {
    const keep = PREF.get("review.open", "");
    try {
      PREF.set("review.open", "");
      go("review", {sub: "steps"});
      await settle();
      const folds = () => [...content().querySelectorAll(".rgroup")];
      ok(folds().length && folds().every(f => !f.open), "a headline open by itself");
      const loose = [...content().querySelectorAll(".group")].filter(g => g.tagName !== "SUMMARY").map(g => g.textContent);
      eq(loose, [], "headlines that do not fold");
      ok(content().querySelector("#rsec-weeks .rgroup"), "the weeks fold too");
      eq(folds().reduce((k, f) => k + f.querySelectorAll(".rstep").length, 0),
        reviewSteps().reduce((k, g) => k + g.steps.length, 0), "every step is in a section");
      const now = content().querySelector(".rstep.now");
      if (now) has(now.closest(".rgroup").querySelector("summary").textContent, "next: ", "the folded line says the next step");
      folds()[0].open = true;
      folds()[0].dispatchEvent(new Event("toggle"));
      render();
      await settle();
      ok(folds()[0].open, "an opened section stays open");
      goReviewSection("weeks");
      await settle();
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 20)));
      ok([...content().querySelectorAll("#rsec-weeks details")].every(d => d.open), "going to a headline opens it");
    } finally { PREF.set("review.open", keep); go("today"); }
  });

  /* ============================================================
     The sidebar, as a page in 8/ (#238)
     ============================================================ */
  const navLabels = () => [...document.querySelectorAll("#nav > .nav-item:not(.pin) .lbl")].map(n => n.textContent);
  const withSidebarPage = async (text, fn) => {
    const was = getPage(SIDEBAR_PATH);
    try {
      if (text == null) { if (was) V.pages.delete(SIDEBAR_PATH); }
      else putPage(SIDEBAR_PATH, parsePage(text));
      clearMemo(); renderNav();
      await fn();
    } finally {
      if (was) putPage(SIDEBAR_PATH, was); else V.pages.delete(SIDEBAR_PATH);
      clearMemo(); go("today"); renderNav();
    }
  };
  test("#238 without 8/sidebar.md the sidebar is the built-in one", () => withSidebarPage(null, () => {
    eq(navItems().filter(it => it && it.id).map(it => it.id),
      NAV_ITEMS.filter(it => it && it.id).map(it => it.id));
    eq(navItems().filter(it => typeof it === "string"), ["sep", "pins", "grow"]);
  }));
  test("#238 8/sidebar.md orders and hides; Settings stays; an unnamed view still shows", () => withSidebarPage(
    "title:: sidebar\nhide:: Waiting for, Settings, contexts\n\n- Next\n- Journal\n- ---\n- Projects\n- Pages\n- People\n- ---\n- Trackers\n- Timer\n",
    () => {
      const l = navLabels();
      ok(l.indexOf("Next") < l.indexOf("Journal"), "Next first: " + l);
      ok(!l.includes("Waiting for") && !l.includes("Contexts"), "hidden ones left out: " + l);
      ok(l.includes("Settings"), "Settings cannot be hidden");
      ok(l.indexOf("Pages") < l.indexOf("People"), "Pages before People: " + l);
      // Organisations is not named: it comes after People, where it sits by default.
      eq(l[l.indexOf("People") + 1], "Organisations");
      eq(navOrder().slice(-3), [NAV_SEP, "trackers", "timer"], "the foot group");
      ok(!checklistPages().includes(SIDEBAR_PATH), "not listed as a checklist");
    }));
  test("#238 the --- lines survive a write and a read", () => {
    const t = "title:: sidebar\n\n- Journal\n- ---\n- Projects\n- ---\n- Timer\n";
    eq(serializePage(parsePage(t)), t);
  });
  test("#238 Settings > Sidebar hides, moves and goes back to the default", () => withSidebarPage(null, async () => {
    go("checklists");
    await settle();
    const row = label => [...content().querySelectorAll(".navset .prow")].find(r => r.textContent.includes(label));
    ok(row("Settings").querySelector("input").disabled, "Settings has no box to untick");
    const box = row("Organisations").querySelector("input");
    box.checked = false; box.dispatchEvent(new Event("change"));
    await settle();
    has(getPage(SIDEBAR_PATH).props.hide, "Organisations", "written as hide::");
    ok(!navLabels().includes("Organisations"), "gone from the sidebar");
    row("Next").querySelector('[data-dir="-1"]').click();
    await settle();
    eq(navOrder()[0], "next", "Next moved to the top");
    eq(navLabels()[0], "Next");
    // Up from the top of the second group crosses the line into the first.
    const i = navOrder().indexOf("projects");
    eq(navOrder()[i - 1], NAV_SEP);
    row("Projects").querySelector('[data-dir="-1"]').click();
    await settle();
    ok(navOrder().indexOf("projects") < navOrder().indexOf(NAV_SEP), "Projects is in the first group");
    content().querySelector(".navset .helpsee .textbtn").click();
    await settle();
    ok(!getPage(SIDEBAR_PATH), "the page is gone");
    eq(navOrder(), navDefaultOrder());
  }));

  /* ============================================================
     A book, as a page in 8/ (#240)
     ============================================================ */
  // Every page put back as it was, since setting a book up also writes a type and a tracker.
  const withBookVault = async (pages, fn) => {
    const was = new Map([...V.pages].map(([p, page]) => [p, structuredClone(page)]));
    const prefs = ["book.scope", curBookKey()].map(k => [k, PREF.get(k, "")]);
    try {
      for (const p of allPages(isBookPath)) V.pages.delete(p);
      for (const [k] of prefs) PREF.set(k, "");
      for (const [p, text] of Object.entries(pages)) putPage(p, parsePage(text), {silent: true});
      clearMemo(); renderNav();
      await fn();
    } finally {
      closeModal();
      V.pages.clear();
      for (const [p, page] of was) { V.pages.set(p, page); V.removed.delete(p); }
      for (const [k, v] of prefs) PREF.set(k, v);
      clearMemo(); go("today"); renderNav();
    }
  };
  // A book's area of its own: no people but those the test brings.
  const withCastVault = (pages, fn) => withBookVault(pages, async () => {
    for (const p of allPeople()) if (!(p in pages)) V.pages.delete(p);
    clearMemo();
    await fn();
  });
  const BOOK_PAGES = {
    [BOOK_PATH]: "title:: book\ntarget:: 1000\nstages:: Idea, Write, Polish, Done\n\n- [[Harbour]]\n- The storm\n- [[Not yet]]\n",
    [join(PAGES, "The storm.md")]: "stage:: Polish\n\n- It was a dark and stormy night.\n  - The [[Harbour]] lay still.\n" +
      "- TODO Check the tide tables\n  - not counted either\n",
    [join(PAGES, "Harbour.md")]: "stage:: done\n\n- Two words\n",
  };
  test("#240 without 8/book.md there is no Book view and Settings only offers to set one up", () => withBookVault({}, async () => {
    ok(!navLabels().includes("Book"), "no Book in the sidebar");
    eq(bookChapters(), []);
    go("checklists");
    await settle();
    const card = content().querySelector(".bookset");
    eq([...card.querySelectorAll("button")].map(b => b.textContent), ["Set up for writing a book"]);
    go("book");
    await settle();
    has(content().textContent, "No book in this area yet.");
  }));
  test("#240 8/book.md orders the chapters, reads their stages and counts their words", () => withBookVault(BOOK_PAGES, async () => {
    renderNav(); ok(navLabels().includes("Book"), "Book is in the sidebar");
    eq(bookChapters().map(c => c.name), ["Harbour", "The storm", "Not yet"], "a bare name is a chapter too");
    eq(bookChapters()[2].path, null, "a page not made yet");
    eq(bookStages().map(s => s.name), ["Idea", "Write", "Polish", "Done"]);
    eq(bookTarget(), 1000);
    const storm = join(PAGES, "The storm.md");
    eq(chapterStage(storm).name, "Polish");
    eq(chapterStage(join(PAGES, "Harbour.md")).core, "DONE", "a stage matches whatever its case");
    eq(chapterWords(storm), 11, "the task and what is under it are not counted");
    go("book");
    await settle();
    eq([...content().querySelectorAll(".bookch .nm")].map(n => n.textContent), ["Harbour", "The storm", "Not yet"]);
    has(content().querySelector(".bookgoal").textContent, "13 of " + fmtWords(1000) + " words");
    has(content().querySelector(".bookgoal").textContent, "1/3 chapters done");
    content().querySelector(".bookch .bookstage").click();
    await settle();
    ok($("#modalRoot").textContent.includes("Polish"), "the stages to pick from");
    closeModal();
    setChapterStage(storm, "Done");
    eq(getPage(storm).props.stage, "Done", "written on the chapter page");
    has(bookManuscript(), "## Harbour\n\nTwo words\n\n## The storm\n\nIt was a dark and stormy night.\n\nThe Harbour lay still.\n\n## Not yet");
    ok(!bookManuscript().includes("tide"), "no tasks in the manuscript");
  }));
  test("#240 what 8/book.md leaves out is the built-in", () => withBookVault({
    [BOOK_PATH]: "title:: book\nstages:: Only one\n\n- [[A chapter]]\n",
    [join(PAGES, "A chapter.md")]: "stage:: Typo\n\n- Words\n",
  }, () => {
    eq(bookStages().map(s => s.name), BOOK_STAGES, "fewer than two stages");
    eq(bookTarget(), null, "no goal");
    eq(chapterStage(join(PAGES, "A chapter.md")).name, "Outline", "a stage nobody listed is the first");
    // A task type, as a link or by its name.
    const type = createStateList("Draft steps", ["Sketch (to do)", "Write (doing)", "Final (done)"]);
    for (const said of ["[[8/Draft steps]]", "Draft steps"]) {
      getPage(BOOK_PATH).props.stages = said; clearMemo();
      eq(bookStages().map(s => s.name), ["Sketch", "Write", "Final"], said);
    }
    ok(isStateList(type));
    ok(!checklistPages().includes(BOOK_PATH), "not listed as a checklist");
    ok(!isTemplatePath(BOOK_PATH), "not a template");
  }));
  test("#240 8/book.md survives a write and a read", () => {
    const t = "title:: book\ntarget:: 80000\nstages:: [[8/Chapter]]\n\n- [[The storm]]\n- [[Harbour]]\n  - the one set at sea\n";
    eq(serializePage(parsePage(t)), t);
  });
  test("#240 Settings > Book sets up, picks, moves and goes back to the default", () => withBookVault({
    [join(PAGES, "The storm.md")]: "- Rain\n", [join(PAGES, "Harbour.md")]: "- Boats\n",
  }, async () => {
    go("checklists");
    await settle();
    content().querySelector(".bookset .btn").click();
    await settle();
    ok(!hasBook(), "nothing is made before it has a name");
    const dlg = $("#modalRoot");
    dlg.querySelector("input").value = "The long road";
    [...dlg.querySelectorAll("button")].find(b => b.textContent === "Create").click();
    await settle();
    const made = join(BOOK_DIR, "The long road.md"), page = getPage(made);
    ok(page, "the page is made, in 8/book/ (#255)");
    eq(bookPath(), made);
    eq(page.props.stages, "[[8/Chapter]]");
    eq(page.props.title, "The long road", "the name asked for");
    eq(bookStages().map(s => s.name), BOOK_STAGES, "the Chapter type has the built-in stages");
    ok(pageHasTracker(getPage(join(DIRS.lists, todayISO().slice(0, 4) + ".md")), "words"), "a Words tracker on every day");
    renderNav(); ok(navLabels().includes("Book"), "Book is in the sidebar");
    const seg = label => [...content().querySelectorAll(".bookset .seg button")].find(b => b.textContent === label);
    seg((100000).toLocaleString()).click();
    await settle();
    eq(page.props.target, "100000");
    eq(content().querySelector(".bookset .seg [aria-checked=true]").textContent, (100000).toLocaleString(), "the goal in use is marked");
    seg("Built in").click();
    await settle();
    ok(!("stages" in page.props), "Built in takes stages:: off");
    addBookChapter("The storm"); addBookChapter("Harbour"); addBookChapter("Harbour");
    await settle();
    eq(bookChapters().map(c => c.name), ["The storm", "Harbour"], "once each");
    const row = name => [...content().querySelectorAll(".bookset .prow")].find(r => r.dataset.ch === name);
    row("Harbour").querySelector('[data-dir="-1"]').click();
    await settle();
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 20)));
    eq(bookChapters().map(c => c.name), ["Harbour", "The storm"]);
    eq(document.activeElement.closest(".prow")?.dataset.ch, "Harbour", "focus stays with the chapter moved");
    row("Harbour").querySelector("[data-drop]").click();
    await settle();
    eq(bookChapters().map(c => c.name), ["The storm"]);
    ok(getPage(join(PAGES, "Harbour.md")), "the page stays");
    const back = [...content().querySelectorAll(".bookset .helpsee .textbtn")];
    eq(back[back.length - 1].textContent, "Back to the default", "last");
    back[back.length - 1].click();
    await settle();
    ok(!getPage(made), "the page is gone");
    renderNav(); ok(!navLabels().includes("Book"), "and Book with it");
    ok(getPage(join(DIRS.lists, "Chapter.md")), "the Chapter type stays");
  }));

  test("#240 Add a chapter offers plain pages and notes, not what is in the book", () => withBookVault({
    ...BOOK_PAGES, [join(PAGES, "Lighthouse.md")]: "- A light\n", [join(DIRS.zettel, "Gulls.md")]: "- Noisy\n",
  }, async () => {
    go("book");
    await settle();
    openAddChapter();
    await settle();
    const items = [...document.querySelectorAll(".scrim .modal")].pop().textContent;
    has(items, "Lighthouse", "a plain page");
    has(items, "Gulls", "a note");
    ok(!items.includes("Harbour"), "not a chapter already in the book");
  }));

  test("#242 a book has a name, a subtitle under it, then its synopsis", () => withBookVault({
    [BOOK_PATH]: "title:: The long road\nsubtitle:: A novel\nsynopsis:: Two sisters cross the hills.\n\n- [[Harbour]]\n",
    [join(PAGES, "Harbour.md")]: "- Boats\n",
  }, async () => {
    go("book");
    await settle();
    eq(content().querySelector(".vhead h1").textContent, "The long road");
    const after = [...content().querySelector(".wrap").children];
    const at = after.indexOf(content().querySelector(".vhead"));
    eq(after[at + 1].className, "booksub", "the subtitle is the first line under the name");
    eq(after[at + 1].textContent, "A novel");
    eq(after[at + 2].textContent, "Two sisters cross the hills.", "then the synopsis");
    ok(bookManuscript().startsWith("# The long road\n\nA novel\n\n## Harbour"), bookManuscript());
    content().querySelector(".bookedit").click();
    await settle();
    const dlg = $("#modalRoot"), inputs = dlg.querySelectorAll("input");
    eq(inputs[0].value, "The long road");
    inputs[1].value = "";
    dlg.querySelector("textarea").value = "Two sisters\ncross the hills.";
    [...dlg.querySelectorAll("button")].find(b => b.textContent === "Save").click();
    await settle();
    ok(!("subtitle" in getPage(BOOK_PATH).props), "an empty subtitle comes off");
    eq(getPage(BOOK_PATH).props.synopsis, "Two sisters cross the hills.", "one line");
    ok(!content().querySelector(".booksub"), "and is not shown");
  }));
  test("#242 a chapter has a synopsis, written on its page", () => withBookVault(BOOK_PAGES, async () => {
    go("book");
    await settle();
    const syn = () => [...content().querySelectorAll(".bookch .chsyn")];
    eq(syn().map(b => b.textContent), ["+ synopsis", "+ synopsis"], "for each chapter with a page");
    syn()[1].click();
    await settle();
    $("#modalRoot textarea").value = "The storm hits the harbour.";
    [...$("#modalRoot").querySelectorAll("button")].find(b => b.textContent === "Save").click();
    await settle();
    const storm = join(PAGES, "The storm.md");
    eq(getPage(storm).props.synopsis, "The storm hits the harbour.");
    eq(syn()[1].textContent, "The storm hits the harbour.", "shown under its name");
    eq(chapterWords(storm), 11, "not counted as words");
    ok(!bookManuscript().includes("hits the harbour"), "nor exported");
    setChapterSynopsis(storm, "  ");
    ok(!("synopsis" in getPage(storm).props), "an empty one comes off");
  }));
  test("#242 chapters move by drag and drop, and by Alt+Shift+arrow", () => withBookVault(BOOK_PAGES, async () => {
    go("book");
    await settle();
    const rows = () => [...content().querySelectorAll(".bookch")];
    const drag = (from, to) => {
      const dt = new DataTransfer();
      rows()[from].dispatchEvent(new DragEvent("dragstart", {bubbles: true, dataTransfer: dt}));
      rows()[to].dispatchEvent(new DragEvent("dragover", {bubbles: true, cancelable: true, dataTransfer: dt}));
      rows()[to].dispatchEvent(new DragEvent("drop", {bubbles: true, cancelable: true, dataTransfer: dt}));
    };
    ok(rows().every(r => r.draggable), "every chapter can be dragged");
    drag(0, 2);
    await settle();
    eq(bookChapters().map(c => c.name), ["The storm", "Not yet", "Harbour"], "dropped on the last, it goes last");
    drag(2, 0);
    await settle();
    eq(bookChapters().map(c => c.name), ["Harbour", "The storm", "Not yet"], "dropped on the first, it goes first");
    rows()[1].querySelector(".nm").dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", altKey: true, shiftKey: true, bubbles: true}));
    await settle();
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 20)));
    eq(bookChapters().map(c => c.name), ["The storm", "Harbour", "Not yet"]);
    eq(document.activeElement.closest(".bookch")?.dataset.ch, "The storm", "focus stays with the chapter moved");
    eq(rows().map(r => r.querySelector(".n").textContent), ["1", "2", "3"], "numbered again");
  }));
  test("#242 a new book asks for its name and area; a tab per book when there are more", async () => {
    const rec = newRecord("Book242", Backends.memory("Book242"));
    rec.pages.set(BOOK_PATH, parsePage("title:: Second book\n\n- [[Gulls]]\n"));
    const was = PREF.get("bookList", "");
    await withBookVault({}, async () => {
      try {
        go("book");
        await settle();
        ok(!content().querySelector(".booktabs"), "no tabs with no other book");
        content().querySelector(".btn.primary").click();
        await settle();
        const dlg = $("#modalRoot");
        const areas = [...dlg.querySelectorAll(".seg button")].map(b => b.textContent);
        eq([areas[0], areas[areas.length - 1]], [V.space, "+ New area"], "this area first, or a new one");
        [...dlg.querySelectorAll("button")].find(b => b.textContent === "Create").click();
        await settle();
        ok(!hasBook(), "not without a name");
        dlg.querySelector("input").value = "First book";
        dlg.querySelectorAll("input")[1].value = "A novel";
        [...dlg.querySelectorAll("button")].find(b => b.textContent === "Create").click();
        await settle();
        eq(getPage(bookPath()).props.title, "First book");
        eq(getPage(bookPath()).props.subtitle, "A novel");
        ok(!content().querySelector(".booktabs"), "one book, no tabs");
        LOADED.set(rec.name, rec);
        Spaces.list.push({name: rec.name, kind: "memory"});
        render();
        await settle();
        const tabs = [...content().querySelectorAll(".booktabs .fchip")];
        eq(tabs.map(t => t.textContent), ["First book", "Second book"], "a tab per book");
        eq(tabs[0].getAttribute("aria-pressed"), "true", "the one shown");
        eq(tabs[1].title, "In Book242");
        openBookInfo({create: true});
        await settle();
        const offered = [...$("#modalRoot").querySelectorAll(".seg button")].map(b => b.textContent);
        ok(offered[0] === V.space && offered.includes("Book242"), "an area with a book is offered too: it can hold more (#255)");
        closeModal();
      } finally {
        LOADED.delete(rec.name);
        const at = Spaces.list.findIndex(s => s.name === rec.name);
        if (at >= 0) Spaces.list.splice(at, 1);
        PREF.set("bookList", was);
      }
    });
  });

  /* Several books in one area, one world (#255) */
  const SERIES_PAGES = {
    [BOOK_PATH]: "title:: First\ndialogue:: english\nprotagonist:: [[Anna]]\n\n- [[Harbour]]\n",
    [join(BOOK_DIR, "Second.md")]: "title:: Second\norder:: 2\ndialogue:: guillemets\n\n- [[Gulls]]\n",
    [join(PAGES, "Harbour.md")]: "- ## Quay\n  pov:: [[Anna]]\n  plot:: The search\n  when:: Day 1\n- Anna ran.\n",
    [join(PAGES, "Gulls.md")]: "- ## Cliff\n  pov:: [[Bo]]\n  plot:: The search\n  when:: Day 5\n- Bo waited.\n",
    [personPath("Anna")]: "- In the story.\n", [personPath("Bo")]: "- In the story.\n", [personPath("Cai")]: "- Not written in yet.\n",
  };
  test("#255 an area holds several books, in series order, and one is shown", () => withCastVault(SERIES_PAGES, async () => {
    eq(bookPaths(), [BOOK_PATH, join(BOOK_DIR, "Second.md")], "8/book.md is a book too; order:: 2 puts Second after it");
    eq(bookPath(), BOOK_PATH, "the first is shown");
    eq(bookChapters().map(c => c.name), ["Harbour"]);
    eq(seriesChapters().map(c => c.name), ["Harbour", "Gulls"]);
    ok(!isTemplatePath(join(BOOK_DIR, "Second.md")) && pageKind(join(BOOK_DIR, "Second.md")) === "page", "a book is a page, not a template");
    go("book");
    await settle();
    eq([...content().querySelectorAll(".booktabs .fchip")].map(t => t.textContent), ["First", "Second"], "a tab per book");
    content().querySelectorAll(".booktabs .fchip")[1].click();
    await settle();
    eq(bookPath(), join(BOOK_DIR, "Second.md"));
    eq(content().querySelector(".vhead h1").textContent, "Second");
    eq(dialogueStyle(), "guillemets", "its own settings");
    eq(dialogueStyle(BOOK_PATH), "english");
    eq(bookOfChapter(join(PAGES, "Harbour.md")), BOOK_PATH);
    openPage(join(PAGES, "Harbour.md"));
    await settle();
    eq(bookPath(), BOOK_PATH, "writing in a chapter shows its book");
    go("checklists");
    await settle();
    const seg = (cls, label) => [...content().querySelectorAll(".bookset ." + cls + " .seg button")].find(b => b.textContent === label);
    seg("bookorder", "2").click();
    await settle();
    eq(bookPaths(), [join(BOOK_DIR, "Second.md"), BOOK_PATH], "First moved to second place");
    eq([getPage(bookPaths()[0]).props.order, getPage(BOOK_PATH).props.order], ["1", "2"], "numbered");
    seg("bookpick", "Second").click();
    await settle();
    eq(bookPath(), join(BOOK_DIR, "Second.md"), "Settings picks the book");
  }));
  test("#255 a new book joins the area's world: last in the series, shown, sharing the cast", () => withCastVault(SERIES_PAGES, async () => {
    setupBook({name: "Third"});
    await settle();
    const third = join(BOOK_DIR, "Third.md");
    eq(bookPath(), third, "the new book is shown");
    eq(bookPaths(), [BOOK_PATH, join(BOOK_DIR, "Second.md"), third]);
    eq(bookPaths().map(p => getPage(p).props.order), ["1", "2", "3"]);
    eq(castEntries().filter(e => e.type === "character").map(e => e.name).sort(), ["Anna", "Bo", "Cai"], "the same cast");
    setupBook({name: "Third"});
    ok(getPage(join(BOOK_DIR, "Third 2.md")), "a name taken gets a number");
    bookDefault();
    await settle();
    ok(!getPage(join(BOOK_DIR, "Third 2.md")) && hasBook(), "Back to the default takes only the book shown");
  }));
  test("#255 Cast shows this book's people and those in no book yet, or all books", () => withCastVault(SERIES_PAGES, async () => {
    const was = PREF.get("sub.book", "");
    try {
      go("book", {sub: "cast"});
      await settle();
      const names = () => [...content().querySelectorAll(".castrow .casttop .nm")].map(n => n.textContent);
      eq(names(), ["Anna", "Cai"], "Bo is only in Second; Cai is in no book yet");
      const scope = label => [...content().querySelectorAll(".bookscope button")].find(b => b.textContent === label);
      scope("All books").click();
      await settle();
      eq(names().sort(), ["Anna", "Bo", "Cai"]);
      eq(castStats("all").get(castEntryOf("Bo").key).scenes, 1, "counted across the series");
    } finally { PREF.set("sub.book", was); }
  }));
  test("#255 Timeline and Plot read all books as one story", () => withCastVault(SERIES_PAGES, async () => {
    eq(bookTimeline("book").rows.map(r => r.scene.name), ["Quay"]);
    eq(bookTimeline("all").rows.map(r => r.scene.name), ["Quay", "Cliff"]);
    const plot = bookPlot("all");
    eq(plot.chapters.map(c => c.name), ["Harbour", "Gulls"]);
    eq(plot.lines.map(l => l.cells.map(c => c.length)), [[1, 1]], "one plotline through both books");
    const was = PREF.get("sub.book", "");
    try {
      PREF.set("book.scope", "all");
      go("book", {sub: "plot"});
      await settle();
      eq([...content().querySelectorAll(".tlhead .tlbook")].map(b => b.textContent), ["First", "Second"], "each book's name over its first chapter");
      eq([...content().querySelectorAll(".tlhead")].map(h => h.textContent), ["First1. Harbour", "Second1. Gulls"]);
    } finally { PREF.set("sub.book", was); }
  }));

  const SCENE_PAGES = {
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n- [[The storm]]\n",
    [join(PAGES, "Harbour.md")]: "- The gulls woke her.\n- ## The quay\n  pov:: [[Anna]]\n  with:: [[Bo]], [[Cai]]\n  when:: Day 3\n" +
      "  - Boats knocked together.\n- She ran.\n- ## Night\n  synopsis:: They wait.\n- Dark now.\n  - TODO check the moon\n",
    [join(PAGES, "The storm.md")]: "- Rain all day.\n",
  };
  test("#243 a ## line starts a scene, which runs to the next one", () => withBookVault(SCENE_PAGES, () => {
    const harbour = join(PAGES, "Harbour.md");
    const scenes = chapterScenes(harbour);
    eq(scenes.map(s => s.name), ["", "The quay", "Night"], "the words before the first ## are the opening");
    eq(scenes[1].lines.map(b => b.title), ["Boats knocked together.", "She ran."], "the lines under it and after it");
    eq(namesIn(sceneProp(scenes[1], "pov")), ["Anna"]);
    eq(namesIn(sceneProp(scenes[1], "with")), ["Bo", "Cai"]);
    eq(namesIn("Bo, Cai"), ["Bo", "Cai"], "names with commas between");
    eq(namesIn("The search, [[The letter]], [[A]] and [[B]]"), ["The search", "The letter", "A", "B"], "names and links mixed");
    eq(sceneProp(scenes[1], "when"), "Day 3");
    eq(sceneWords(scenes[1]), 5);
    eq(sceneWords(scenes[2]), 2, "no task");
    eq(chapterWords(harbour), 11, "the ## line is not counted");
    eq(chapterScenes(join(PAGES, "The storm.md")).map(s => s.name), [""], "no ## line is one scene with no name");
    has(bookManuscript(), "## Harbour\n\nThe gulls woke her.\n\n* * *\n\nBoats knocked together.\n\nShe ran.\n\n* * *\n\nDark now.\n\n## The storm\n\nRain all day.");
    ok(!bookManuscript().includes("The quay"), "a scene's name is not in the manuscript");
  }));
  test("#243 the Book view lists the scenes; ✎ sets their values; + scene adds one", () => withBookVault(SCENE_PAGES, async () => {
    go("book");
    await settle();
    const rows = () => [...content().querySelectorAll(".bookch")];
    eq([...rows()[0].querySelectorAll(".bookscene .scn")].map(b => b.textContent), ["Opening", "The quay", "Night"]);
    has(rows()[0].querySelectorAll(".bookscene")[1].textContent, "Anna");
    has(rows()[0].querySelectorAll(".bookscene")[1].textContent, "Day 3");
    ok(!rows()[1].querySelector(".bookscenes"), "a chapter with no scene lists none");
    ok(rows()[1].querySelector(".scenenew"), "but can have one added");
    rows()[0].querySelectorAll(".bookscene button.scedit")[1].click();
    await settle();
    const dlg = $("#modalRoot"), inputs = [...dlg.querySelectorAll("input, textarea")];
    eq(inputs[0].value, "Night");
    inputs[0].value = "Late night";
    inputs[1].value = "[[Bo]]";
    inputs[6].value = "";
    [...dlg.querySelectorAll("button")].find(b => b.textContent === "Save").click();
    await settle();
    const b = chapterScenes(join(PAGES, "Harbour.md"))[2].block;
    eq(b.title, "## Late night");
    eq(b.props.pov, "[[Bo]]");
    ok(!("synopsis" in b.props), "an emptied value comes off");
    const storm = join(PAGES, "The storm.md");
    addScene(storm, "Flood");
    eq(chapterScenes(storm).map(s => s.name), ["", "Flood"]);
    eq(serializeBlocks(getPage(storm).blocks), "- Rain all day.\n- ## Flood\n-");
  }));

  test("#244 a %% line is an ordinary line: counted and exported, with no beat or mark commands", () => withBookVault({
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n",
    [join(PAGES, "Harbour.md")]: "- %% She finds the letter\n  - The envelope was wet.\n- Night fell.\n",
  }, () => {
    const harbour = join(PAGES, "Harbour.md");
    eq(chapterText(harbour), ["%% She finds the letter", "The envelope was wet.", "Night fell."]);
    has(bookManuscript(), "letter");
    ok(["beat", "script", "thought", "sound", "written"].every(id => !slashRows(id).some(r => r.id === id)), "no command for them");
  }));
  test("#244 a chapter page has Outline and Prose, Focus, and today's words", () => withBookVault({
    [BOOK_PATH]: "title:: book\ndaily:: 500\n\n- [[Harbour]]\n",
    [join(PAGES, "Harbour.md")]: "- The envelope was wet.\n- Night fell.\n",
    [join(PAGES, "Elsewhere.md")]: "- Not a chapter\n",
  }, async () => {
    const harbour = join(PAGES, "Harbour.md"), was = [PREF.get("book.mode", "")];
    const dayKey = "book.day." + (V.space || "");
    try {
      PREF.set(dayKey, JSON.stringify({d: todayISO(), w: 2}));
      eq(bookToday(), 4, "six words now, two when the day began");
      PREF.set(dayKey, JSON.stringify({d: "2001-01-01", w: 0}));
      eq(bookToday(), 0, "a new day starts from what is there");
      eq(bookDaily(), 500);
      openPage(join(PAGES, "Elsewhere.md"));
      await settle();
      ok(!content().querySelector(".chapterbar"), "no bar on a page that is not a chapter");
      PREF.set("book.mode", "outline");
      openPage(harbour);
      await settle();
      has(content().querySelector(".chapterbar").textContent, "0 of 500 today");
      ok(!content().querySelector(".outline.prose"), "Outline first");
      [...content().querySelectorAll(".chapterbar .vseg button")].find(b => b.textContent === "Prose").click();
      await settle();
      ok(content().querySelector(".outline.prose"), "Prose");
      content().querySelector(".chapterbar .focusbtn").click();
      ok(document.body.classList.contains("bookfocus") && $("#focusLeave"), "Focus");
      document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
      ok(!document.body.classList.contains("bookfocus") && !$("#focusLeave"), "Esc leaves it");
    } finally {
      PREF.set("book.mode", was[0]); setWritingFocus(false);
    }
  }));
  test("#244 Settings > Book picks the words a day", () => withBookVault({[BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n"}, async () => {
    go("checklists");
    await settle();
    [...content().querySelectorAll(".bookdaily .seg button")].find(b => b.textContent === fmtWords(1000)).click();
    await settle();
    eq(getPage(BOOK_PATH).props.daily, "1000");
    [...content().querySelectorAll(".bookdaily .seg button")].find(b => b.textContent === "None").click();
    await settle();
    ok(!("daily" in getPage(BOOK_PATH).props), "None takes it off");
  }));

  test("#245 quotes, dashes and dots are set in the book's style as they are typed", () => {
    const typed = (text, style) => { const r = typeSet(text, text.length, style); return r ? r.text : text; };
    eq(typed("\"", "english"), "“");
    eq(typed("“Go,\"", "english"), "“Go,”");
    eq(typed("she said, \"", "english"), "she said, “");
    eq(typed("\"", "guillemets"), "«");
    eq(typed("«Hei\"", "guillemets"), "«Hei»");
    eq(typed("\"", "german"), "„");
    eq(typed("„Ja\"", "german"), "„Ja“");
    eq(typed("don'", "english"), "don’", "an apostrophe");
    eq(typed("'", "english"), "‘");
    eq(typed("Wait..", "english"), "Wait..", "two dots are two dots");
    eq(typed("Wait...", "english"), "Wait…");
    eq(typed("so--", "english"), "so—");
    eq(typed("so--", "guillemets"), "so–");
    eq(typed("- ", "dash"), "– ", "a line of speech starts with a dash");
    eq(typed("- ", "english"), "- ", "only with Dash");
    eq(typeSet("ab\"cd", 3, "english"), {text: "ab”cd", caret: 3}, "where the caret is, not at the end");
    eq(typeSet("\"", 1, "nope"), null, "no style, no change");
    eq(tidyLine("\"Go,\" she said. 'Now' -- don't wait...", "english"), "“Go,” she said. ‘Now’ — don’t wait…");
    eq(tidyLine("“Go,” she said.", "guillemets"), "«Go,» she said.", "another style's marks become this one's");
    eq(tidyLine("«Ja», sa hun.", "german"), "„Ja“, sa hun.");
    eq(tidyLine("- Kom, sa hun.", "dash"), "– Kom, sa hun.");
  });
  test("#245 in a chapter, typing sets the marks; Settings picks the style and tidies the book", () => withBookVault({
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n",
    [join(PAGES, "Harbour.md")]: "- \"Go,\" she said.\n  - TODO fix \"this\"\n",
    [join(PAGES, "Elsewhere.md")]: "- Not a chapter\n",
  }, async () => {
    const harbour = join(PAGES, "Harbour.md");
    const typeInto = async (path, text) => {
      openPage(path);
      await settle();
      const txt = content().querySelector(".blk .txt");
      txt.focus();
      setHostText(txt, text, text.length);
      txt.dispatchEvent(new InputEvent("input", {inputType: "insertText", data: text.slice(-1), bubbles: true}));
      return lineText(txt);
    };
    eq(await typeInto(harbour, "Say \""), "Say \"", "as typed, before a style is picked");
    setDialogueStyle("english");
    eq(await typeInto(harbour, "Say \""), "Say “");
    eq(await typeInto(join(PAGES, "Elsewhere.md"), "Say \""), "Say \"", "only in a chapter");
    closeModal(); go("checklists");
    await settle();
    [...content().querySelectorAll(".bookdialogue .seg button")].find(b => b.textContent === DIALOGUE.guillemets.label).click();
    await settle();
    eq(getPage(BOOK_PATH).props.dialogue, "guillemets");
    getPage(harbour).blocks[0].title = "\"Go,\" she said.";
    content().querySelector(".booktidy").click();
    await settle();
    eq(getPage(harbour).blocks[0].title, "«Go,» she said.");
    eq(getPage(harbour).blocks[0].children[0].title, "fix \"this\"", "a task is left as it is");
    [...document.querySelectorAll("#toasts .toast")].pop().querySelector(".act").click();
    eq(getPage(harbour).blocks[0].title, "\"Go,\" she said.", "Undo");
    [...content().querySelectorAll(".bookdialogue .seg button")].find(b => b.textContent === "As typed").click();
    await settle();
    ok(!("dialogue" in getPage(BOOK_PATH).props), "As typed takes it off");
    ok(!content().querySelector(".booktidy"), "and there is nothing to tidy to");
  }));

  const CAST_PAGES = {
    [BOOK_PATH]: "title:: book\ndialogue:: english\n\n- [[Harbour]]\n- [[The storm]]\n",
    [join(PAGES, "Harbour.md")]: "- ## The quay\n  pov:: [[Anna Berg]]\n  with:: [[Bo]]\n" +
      "  - “We should go,” said Bo.\n  - “Not yet.”\n  - “Anna, now.”\n" +
      "- ## Night\n  pov:: [[Mira]]\n  with:: [[Bobby]]\n  - Mira lit the lamp. “The boats are loose,” she said.\n  - “Then we row,” Bo said.\n",
    [join(PAGES, "The storm.md")]: "- ## Rain\n  pov:: [[Anna Berg]]\n  - Anna ran to the [[Old mill]].\n",
    [personPath("Anna Berg")]: "wants:: To find her father\n\n- The eldest.\n",
    [personPath("Bo")]: "aliases:: Bobby\n",
    [join(PAGES, "Old mill.md")]: "type:: place\n",
    [join(PAGES, "Gulls.md")]: "- Not in the cast\n",
  };
  test("#247 the cast: the area's people, pages typed place or thing, and names a scene gives", () => withCastVault(CAST_PAGES, () => {
    const cast = castEntries();
    eq(cast.map(e => e.name + ":" + e.type).sort(), ["Anna Berg:character", "Bo:character", "Mira:character", "Old mill:place"]);
    eq(cast.find(e => e.name === "Anna Berg").names, ["Anna Berg", "Anna"], "a full name is also its first word");
    eq(cast.find(e => e.name === "Bo").names, ["Bo", "Bobby"], "and its aliases");
    eq(cast.find(e => e.name === "Mira").path, null, "named in a scene, no page");
    eq(castEntryOf("Bobby").name, "Bo", "an alias in with:: is that page");
    eq(castNamesOf("Old Tomas"), ["Old Tomas", "Tomas"], "past a title");
    eq(castNamesOf("The harbour", [], "place"), ["The harbour"], "a place only by its whole name");
    eq(castMentions("Bobby met Anna; will Will?").map(m => castEntries().find(e => e.key === m.key).name), ["Bo", "Anna Berg"]);
  }));
  test("#247 a character is a person page; a writer is not cast; a place or thing comes from its template", () => withCastVault({
    ...CAST_PAGES, [personPath("Kari Writer")]: "member:: true\n",
  }, () => {
    ok(!castEntries().some(e => e.name === "Kari Writer"), "somebody who uses the app is a writer");
    setupBook();
    ok(getPage(join(DIRS.lists, "place.md")) && getPage(join(DIRS.lists, "thing.md")), "setting up writes the templates");
    clearMemo();
    ok(!castEntries().some(e => e.path && isTemplatePath(e.path)), "a template is not in the cast");
    const mira = makeCastPage("Mira");
    eq(mira, personPath("Mira"), "Make a page makes a person page");
    eq(castEntries().find(e => e.name === "Mira").path, mira);
    getPage(join(DIRS.lists, "place.md")).props.climate = "";
    const quay = makeCastPage("The quay", "place");
    eq(getPage(quay).props.type, "place");
    ok("climate" in getPage(quay).props, "from the template, as it is in 8/");
    eq(castEntries().find(e => e.name === "The quay").type, "place");
  }));
  test("#247 who speaks each line: the name outside the quotes, or back and forth", () => withCastVault(CAST_PAGES, () => {
    const {scenes} = bookAnalysis(), who = k => k ? castEntries().find(e => e.key === k).name : null;
    eq(scenes.map(sc => sc.scene.name), ["The quay", "Night", "Rain"]);
    eq(scenes[0].speeches.map(x => who(x.speaker)), ["Bo", "Anna Berg", "Bo"], "untagged, the other of the two; then back again");
    eq(scenes[0].speeches.map(x => who(x.to)), [null, "Bo", "Anna Berg"]);
    eq(scenes[1].speeches.map(x => who(x.speaker)), ["Mira", "Bo"], "a name before the quotes, then after");
    ok(scenes[0].speeches[2].names.has(personPath("Anna Berg")), "Anna is named in what Bo says");
    ok(scenes[2].present.has(join(PAGES, "Old mill.md")), "a place named in the text is in the scene");
    eq(speechParts("He said “go” and “now”.", "english").said, ["go", "now"]);
    eq(speechParts("– Kom, sa Mira. – Nå.", "dash"), {said: ["Kom, Nå."], rest: "sa Mira. "});
    eq(speechParts("– Anna, kom hit!", "dash"), {said: ["Anna, kom hit!"], rest: ""}, "a tag that names nobody is speech");
  }));
  test("#247 the protagonist, and the four signs of depth for any character", () => withCastVault(CAST_PAGES, () => {
    const anna = personPath("Anna Berg"), bo = personPath("Bo");
    eq(bookProtagonist(), anna, "the one who sees the most scenes");
    const st = castStats(), mira = [...st.values()].find(s => s.entry.name === "Mira");
    eq(st.get(bo).spoken, 8);
    eq(st.get(anna).lines, 1);
    eq(Math.round(100 * st.get(bo).share), 57, "8 of 14 words said");
    eq(st.get(bo).without, 1, "Night has no Anna");
    eq(st.get(bo).talks.get(anna), 2, "with Anna in The quay");
    const depth = s => Object.fromEntries(s.depth.map(d => [d.k, d.na ? "na" : d.ok]));
    eq(depth(st.get(anna)), {wants: true, arc: false, alone: "na", talk: "na"}, "the protagonist is not measured against herself");
    eq(depth(st.get(bo)), {wants: false, arc: false, alone: true, talk: true});
    eq(st.get(bo).other.with, mira.entry.key, "Bo and Mira talk of the boats");
    eq(depth(mira).talk, true);
    eq(st.get(join(PAGES, "Old mill.md")).depth, null, "a place has no depth to measure");
    getPage(BOOK_PATH).props.protagonist = "[[Bo]]"; clearMemo();
    eq(bookProtagonist(), bo, "protagonist:: says whose story it is");
    eq(depth(castStats().get(anna)).talk, false, "Anna never talks with anybody but Bo");
  }));
  test("#247 Book › Cast lists the cast, the protagonist first, and writes what is missing", () => withCastVault(CAST_PAGES, async () => {
    const was = PREF.get("sub.book", "");
    try {
      go("book", {sub: "cast"});
      await settle();
      const names = () => [...content().querySelectorAll(".castrow .nm")].map(n => n.textContent);
      eq(names(), ["Anna Berg", "Bo", "Mira", "Old mill"]);
      has(content().querySelector(".casthero").textContent, "Anna Berg");
      const anna = content().querySelector(".castrow");
      has(anna.querySelector(".castfacts").textContent, "2 scenes");
      has(anna.querySelector(".castfacts").textContent, "Harbour – The storm");
      eq(anna.querySelector(".castscore .ratio").textContent, "1/2");
      [...anna.querySelectorAll("button.dep")].find(b => b.textContent.includes("Changes")).click();
      await settle();
      $("#modalRoot input").value = "From afraid to brave";
      [...$("#modalRoot").querySelectorAll("button")].find(b => b.textContent === "Save").click();
      await settle();
      eq(getPage(personPath("Anna Berg")).props.arc, "From afraid to brave");
      eq(content().querySelector(".castrow .castscore .ratio").textContent, "2/2");
      [...content().querySelectorAll(".castrow")].find(r => r.dataset.key.includes("mira")).querySelector(".castmake").click();
      await settle();
      ok(getPage(personPath("Mira")), "+ Make a page writes a person page");
      ok(![...content().querySelectorAll(".castmake")].length, "and Mira has one now");
    } finally { PREF.set("sub.book", was); }
  }));

  test("#249 relations: shared scenes, talk and ties the pages name, between two chapters", () => withCastVault({
    ...CAST_PAGES, [personPath("Bo")]: "aliases:: Bobby\nbrother:: [[Anna Berg]]\nrole:: [[Anna Berg]]\n",
  }, async () => {
    const anna = personPath("Anna Berg"), bo = personPath("Bo");
    const rel = bookRelations(), ab = rel.pairs.find(p => [p.a, p.b].includes(anna) && [p.a, p.b].includes(bo));
    eq([ab.scenes, ab.talk, ab.said], [1, 2, ["brother"]], "one scene, two answers, and a tie on Bo's page; role:: is about Bo");
    eq(rel.seen.get(anna), 2);
    const late = bookRelations(1, 1);
    eq(late.pairs.find(p => p === late.pairs.find(q => [q.a, q.b].includes(anna) && [q.a, q.b].includes(bo))).scenes, 0, "not in The storm");
    eq(late.seen.get(bo), undefined);
    const was = [PREF.get("sub.book", ""), PREF.get("book.rel.from", ""), PREF.get("book.rel.to", "")];
    try {
      REL.sel = null;
      go("book", {sub: "relations"});
      await settle();
      eq([...content().querySelectorAll(".relnode")].map(g => g.getAttribute("aria-label")), ["Anna Berg", "Bo", "Mira"], "the protagonist first");
      ok(content().querySelector(".relnode.hero"), "in the middle");
      has(content().querySelector(".rellist").textContent, "brother");
      content().querySelectorAll(".relnode")[2].dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
      await settle();
      eq(REL.sel, [...castEntries()].find(e => e.name === "Mira").key, "Enter picks a character");
      has(content().querySelector(".section h3").textContent, "Ties of Mira");
      eq(content().querySelectorAll(".relrow").length, 1, "only Mira's ties: Bo");
    } finally { REL.sel = null; PREF.set("sub.book", was[0]); PREF.set("book.rel.from", was[1]); PREF.set("book.rel.to", was[2]); }
  }));

  test("#250 the timeline reads when::, marks what is told out of order, and finds a character in two places", () => withCastVault({
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n- [[The storm]]\n",
    [join(PAGES, "Harbour.md")]: "- ## A\n  pov:: [[Anna]]\n  with:: [[Bo]]\n  place:: [[Mill]]\n  when:: Day 2\n" +
      "- ## B\n  pov:: [[Bo]]\n  when:: Day 1, evening\n",
    [join(PAGES, "The storm.md")]: "- ## C\n  pov:: [[Mira]]\n  with:: [[Bo]]\n  place:: [[Quay]]\n  when:: day 2\n" +
      "- ## D\n  when:: two weeks later\n- ## E\n  when:: 1990\n",
    [personPath("Anna")]: "- In the story.\n", [personPath("Bo")]: "- In the story.\n",
  }, async () => {
    eq(storyTime("Day 3"), {kind: "day", at: 3});
    eq(storyTime("Dag 3, kveld"), {kind: "day", at: 3.8});
    eq(storyTime("3, morning"), {kind: "day", at: 3.2});
    eq(storyTime("1987-06-14"), {kind: "date", at: 19870614});
    eq(storyTime("1987"), {kind: "date", at: 19870000});
    eq(storyTime("two weeks later"), null);
    const {rows, clock, clashes} = bookTimeline();
    eq(clock, "day", "the kind most scenes use");
    eq(rows.map(r => r.scene.name + (r.back ? "↶" : "") + (r.t ? "" : "?")), ["A", "B↶", "C", "D?", "E?"]);
    eq(clashes.map(x => castEntries().find(e => e.key === x.who).name + " " + x.a.scene.name + x.b.scene.name), ["Bo AC"],
      "Bo at the mill and on the quay on day 2");
    const was = PREF.get("sub.book", "");
    try {
      go("book", {sub: "timeline"});
      await settle();
      eq([...content().querySelectorAll(".tlhead")].map(h => h.textContent), ["Day 1, evening", "Day 2"]);
      eq([...content().querySelectorAll(".tllane")].map(h => h.textContent), ["Anna", "Bo", "Mira"]);
      eq([...content().querySelectorAll(".tlscene.back")].map(b => b.textContent), ["2B"]);
      has(content().textContent, "In two places at once");
      has(content().textContent, "“two weeks later” is not read as a time");
    } finally { PREF.set("sub.book", was); }
  }));

  test("#251 the plot grid: a row per plotline, its scenes by chapter, and its long gaps", () => withCastVault({
    [BOOK_PATH]: "title:: book\n\n- [[One]]\n- [[Two]]\n- [[Three]]\n- [[Four]]\n- [[Five]]\n",
    [join(PAGES, "One.md")]: "- ## Start\n  plot:: The search, [[The letter]]\n",
    [join(PAGES, "Two.md")]: "- ## Middle\n  plot:: the search\n",
    [join(PAGES, "Three.md")]: "- ## Lost\n",
    [join(PAGES, "Four.md")]: "- Words.\n",
    [join(PAGES, "Five.md")]: "- ## End\n  plot:: The letter\n",
  }, async () => {
    const {lines, loose} = bookPlot();
    eq(lines.map(l => l.name), ["The search", "The letter"], "one row each, whatever the case");
    eq(lines[0].cells.map(c => c.map(sc => sc.scene.name).join()), ["Start", "Middle", "", "", ""]);
    eq([...lines[0].gaps], [], "nothing after its last chapter is a gap");
    eq([...lines[1].gaps], [1, 2, 3], "three chapters without The letter");
    eq(loose.map(sc => sc.scene.name), ["Lost"], "a scene with no plotline; an opening is not asked for one");
    const was = PREF.get("sub.book", "");
    try {
      go("book", {sub: "plot"});
      await settle();
      eq([...content().querySelectorAll(".tllane")].map(n => n.textContent), ["The search", "The letter"]);
      eq(content().querySelectorAll(".plotgap").length, 3);
      has(content().textContent, "Scenes with no plotline");
    } finally { PREF.set("sub.book", was); }
  }));

  test("#252 darlings: a sentence, a paragraph, a scene and a chapter are cut, kept and put back", () => withBookVault({
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n- [[The storm]]\n",
    [join(PAGES, "Harbour.md")]: "- First line.\n- She ran. “Wait!” he said. The end\n  - under it\n- Last line.\n- ## Night\n- Dark.\n- Darker.\n- ## Dawn\n- Light.\n",
    [join(PAGES, "The storm.md")]: "- Rain.\n",
  }, async () => {
    const harbour = join(PAGES, "Harbour.md"), titles = () => getPage(harbour).blocks.map(b => b.title);
    const t = "She ran. “Wait!” he said. The end";
    eq(sentenceAt(t, 2), {start: 0, end: 9});
    eq(t.slice(...Object.values(sentenceAt(t, 12))), "“Wait!” he said. ");
    eq(t.slice(...Object.values(sentenceAt(t, t.length))), "The end", "at the end, the last one");
    eq(sentenceAt("No stop here", 3), {start: 0, end: 12});
    const ran = getPage(harbour).blocks[1];
    cutSentenceToDarlings(harbour, ran, t, 12);
    eq(ran.title, "She ran. The end");
    eq(darlings()[0].title, "“Wait!” he said.");
    eq(darlingWords(), 3);
    eq(chapterWords(harbour), 13, "not counted in the book");
    putBack(DARLINGS_PATH, darlings()[0]);
    eq(ran.title, "She ran. The end “Wait!” he said.", "back at the end of its line");
    cutLineToDarlings(harbour, ran);
    eq(titles(), ["First line.", "Last line.", "## Night", "Dark.", "Darker.", "## Dawn", "Light."]);
    eq(darlings()[0].children.map(b => b.title), ["under it"], "with what is under it");
    putBack(DARLINGS_PATH, darlings()[0]);
    eq(titles()[1], ran.title, "after the line it followed");
    ok(!("from" in ran.props) && !("cut" in ran.props), "with nothing left of its time away");
    const night = getPage(harbour).blocks[3];
    cutLineToDarlings(harbour, night);
    eq(titles(), ["First line.", ran.title, "Last line.", "## Dawn", "Light."], "a scene goes with its lines");
    eq(chapterScenes(harbour).map(s => s.name), ["", "Dawn"]);
    putBack(DARLINGS_PATH, darlings()[0]);
    eq(titles(), ["First line.", ran.title, "Last line.", "## Night", "Dark.", "Darker.", "## Dawn", "Light."], "and comes back as written");
    go("book", {sub: "chapters"});
    await settle();
    content().querySelectorAll(".bookch .chcut")[1].click();
    await settle();
    eq(bookChapters().map(c => c.name), ["Harbour"]);
    ok(getPage(join(PAGES, "The storm.md")), "the chapter's page stays");
    content().querySelector(".bookdarlings").click();
    await settle();
    [...$("#modalRoot").querySelectorAll(".darling .textbtn")][0].click();
    eq(bookChapters().map(c => c.name), ["Harbour", "The storm"], "Put back: in its place again");
    closeModal();
    ok(!isTemplatePath(DARLINGS_PATH) && pageKind(DARLINGS_PATH) === "page", "the page is no template");
  }));

  test("#252 refile to a page with putback:: remembers the place, and Put back returns the line", () => withBookVault({
    [join(PAGES, "Shelf.md")]: "putback:: yes\n\n- Old idea\n",
    [join(PAGES, "Plain.md")]: "- Old idea\n",
    [join(PAGES, "Notes.md")]: "- One\n- Two\n- Three\n",
  }, () => {
    const notes = join(PAGES, "Notes.md"), shelf = join(PAGES, "Shelf.md"), plain = join(PAGES, "Plain.md");
    const titles = () => getPage(notes).blocks.map(b => b.title);
    const two = getPage(notes).blocks[1];
    refileBlock(notes, two, shelf);
    eq(titles(), ["One", "Three"]);
    ok(blockProp(two, "from").includes("Notes") && blockProp(two, "cut"), "it says where it came from");
    putBack(shelf, two);
    eq(titles(), ["One", "Two", "Three"], "back after the line it followed");
    ok(!("from" in two.props), "nothing left of its time away");
    const one = getPage(notes).blocks[0];
    refileBlock(notes, one, plain);
    ok(!blockProp(one, "from"), "a page without putback:: remembers nothing");
  }));

  test("#254 togglePutBack turns putback:: on and off for any page", () => withBookVault({
    [join(PAGES, "Plain.md")]: "- One\n",
  }, () => {
    const plain = join(PAGES, "Plain.md");
    ok(!putsBack(plain));
    togglePutBack(plain);
    ok(putsBack(plain), "on");
    togglePutBack(plain);
    ok(!putsBack(plain) && !("putback" in getPage(plain).props), "off, and the property is gone");
  }));

  test("#253 Read shows the whole book as prose,and a change there is a change to the chapter", () => withBookVault(BOOK_PAGES, async () => {
    const was = PREF.get("sub.book", "");
    try {
      go("book", {sub: "read"});
      await settle();
      eq([...content().querySelectorAll(".readhead .nm")].map(n => n.textContent), ["Harbour", "The storm"], "the chapters with a page, in order");
      eq(content().querySelectorAll(".readch .outline.prose").length, 2);
      const storm = join(PAGES, "The storm.md"), b = getPage(storm).blocks[0];
      const txt = content().querySelector('.readch .blk[data-id="' + b.id + '"] .txt');
      txt.focus();
      txt.textContent = "It was a quiet night.";
      txt.blur();
      eq(getPage(storm).blocks[0].title, "It was a quiet night.");
    } finally { PREF.set("sub.book", was); }
  }));

  test("#254 Revise measures a chapter: LIX, long sentences, talk, telling words, adverbs and repeats", () => {
    const long = Array.from({length: 31}, (_, i) => "Word" + i).join(" ") + ".";
    const look = proseLook(["She felt cold. He walked slowly home.", "“Go now,” she said. " + long, "The harbour was dark and the harbour was still."], "english");
    eq(look.sentences, 5);
    eq(look.long.map(x => x.n), [31]);
    eq(look.filters.map(x => x.word), ["felt"]);
    eq(look.adverbs.map(x => x.word), ["slowly"]);
    eq(look.repeats.map(x => x.word), ["harbour"]);
    eq(look.said, 2, "Go now");
    ok(look.lix > 0 && look.avg > 0);
    eq(sentencesOf("“Wait!” he said. Then she left."), ["“Wait!” he said.", "Then she left."]);
    eq(lixWord(25), "very easy");
    eq(lixWord(55), "hard");
  });
  test("#254 a chapter that moves on a stage is not copied; Revise still flags facts a page disagrees with", () => withCastVault({
    [BOOK_PATH]: "title:: book\n\n- [[Harbour]]\n",
    [join(PAGES, "Harbour.md")]: "stage:: Draft\n\n- First.\n- Anna's eyes were blue.\n",
    [personPath("Anna")]: "eyes:: green\n",
  }, async () => {
    const harbour = join(PAGES, "Harbour.md"), pagesBefore = V.pages.size;
    setChapterStage(harbour, "Revise");
    eq(getPage(harbour).props.stage, "Revise");
    eq(V.pages.size, pagesBefore, "no copy of the chapter is made");
    eq(factClashes().map(x => x.who + " " + x.fact + "/" + x.said), ["Anna green/blue"]);
    const was = PREF.get("sub.book", "");
    try {
      REV.open = null;
      go("book", {sub: "revise"});
      await settle();
      content().querySelector("button.revrow").click();
      await settle();
      ok(!content().querySelector(".revsnap"), "no snapshot block");
      has(content().textContent, "Not as their page says");
    } finally { REV.open = null; PREF.set("sub.book", was); }
  }));

  test("#241 in a book's area the names offered are that area's own, its pages too", async () => {
    const rec = newRecord("Book241", Backends.memory("Book241"));
    for (const [p, text] of Object.entries({
      [BOOK_PATH]: "title:: book\n\n- [[Varyhall]]\n",
      [join(PAGES, "Vary.md")]: "role:: healer\n\n- Old, kind, tired.\n",
      [join(PAGES, "Varyhall.md")]: "- Chapter one\n",
      [join(DIRS.people, "Varyn Book.md")]: "title:: Varyn Book\n",
    })) rec.pages.set(p, parsePage(text));
    const vb = join(DIRS.people, "Varyo Borge.md");
    const was = PREF.get("visibleSpaces", "");
    const box = el("div", {data: {space: "Book241"}}), input = el("input");
    box.append(input); document.body.append(box);
    const offered = text => { input.value = text; input.setSelectionRange(text.length, text.length);
      return (suggestFor(input, {})?.rows || []).filter(r => !r.isNew).map(r => r.ref); };
    try {
      putPage(vb, parsePage("title:: Varyo Borge\n"), {silent: true});
      LOADED.set(rec.name, rec);
      setVisibleSpaces([V.space, rec.name]); clearMemo();
      eq(offered("She looked at Vary").sort(), ["Vary", "p/Varyn Book"], "a page of the book's area, and no Varyo from the other area, nor the chapter");
      eq(offered("[[Vary"), ["Vary", "Varyhall", "p/Varyn Book"], "[[ lists the book's area only");
      ok(!linkKnownNames("Varyo Borge and Vary met", "", namesFor(input)).includes("[["), "nothing linked from another area, and a page is never linked unasked");
      box.dataset.space = V.space; clearMemo();
      ok(offered("She looked at Vary").includes("p/Varyo Borge"), "an area without a book offers every area's names, as before");
    } finally {
      box.remove(); LOADED.delete(rec.name); PREF.set("visibleSpaces", was);
      V.pages.delete(vb); V.removed.delete(vb); clearMemo(); renderNav();
    }
  });

  test("#258 with several areas on, a person offered as you type shows their area, and the link written does not", async () => {
    const n = "Test258 Home", was = PREF.get("visibleSpaces", "");
    const path = join(DIRS.people, "Testarea Person.md");
    const input = el("input"); document.body.append(input);
    const offer = text => { input.value = text; input.setSelectionRange(text.length, text.length); suggestSync(input, {}); return SUGGEST; };
    const personRows = () => [...SUGGEST.box.querySelectorAll(".pick")].filter(b => b.textContent.includes("Testarea Person"));
    await createSpace(n, "local");
    try {
      if (!LOADED.has(n)) LOADED.set(n, newRecord(n, Backends.memory(n)));
      LOADED.get(n).pages.set(path, parsePage("title:: Testarea Person\n"));
      putPage(path, parsePage("title:: Testarea Person\n"), {silent: true});
      setVisibleSpaces([V.space, n]); clearMemo();
      const s = offer("Call Testarea P");
      ok(s, "no list for the name");
      const rows = personRows();
      eq(rows.length, 2, "one row per area");
      eq(rows.map(b => b.querySelector(".sp")?.textContent).sort(), [V.space, n].sort(), "each row names its area, in full");
      const home = rows.find(b => b.querySelector(".sp")?.textContent === n);
      has(home.querySelector(".sp").getAttribute("style"), spaceColor(n), "the area's own colour");
      suggestAccept(s.rows.findIndex(r => r.kind === "person" && r.space === n));
      has(input.value, "Call [[p/Testarea Person]]", "the person link as before");
      ok(!input.value.includes(n), "the area went into the line");
      setVisibleSpaces([V.space]); clearMemo();
      offer("Call Testarea P");
      eq(personRows().length, 1, "one area on: its own person once");
      ok(!SUGGEST.box.querySelector(".sp"), "one area on, and the area is still shown");
    } finally {
      suggestClose(); input.remove(); PREF.set("visibleSpaces", was);
      V.pages.delete(path); V.removed.delete(path); await removeArea(n); clearMemo(); renderNav();
    }
  });

  /* ============================================================
     Timer
     ============================================================ */
  test("Copy as plain text: state and words only, no links, tags, properties or children", () => {
    const b = newBlock({state: "WAIT", title: "New date for meeting [[p/Håkon Moe]] #mail [[2026-11-03]]",
      children: [newBlock({state: "TODO", title: "See e-mail"})]});
    eq(plainLineText(b), "WAIT New date for meeting Håkon Moe 2026-11-03");
    eq(plainLineText(newBlock({title: "A note [[Some page]]"})), "A note Some page");
    eq(EDIT_BAR.some(r => r.k === "plaincopy"), true, "on the bar");
  });

  test("#297 the mobile line toolbar can add a context, person or organisation", () => {
    const path = scratchProject("editbar tag", [["TODO", "Buy paint"]]);
    const page = getPage(path), block = page.blocks[0];
    const box = el("div"), txt = el("textarea");
    document.body.append(box, txt);
    FLY = {txt, path, page, block, box, open: null, hi: 0, q: ""};
    try {
      for (const k of ["ctx", "who", "org"]) {
        ok(EDIT_BAR.some(r => r.k === k), k + " is on the bar");
        FLY.open = null;
        editBarAct(k);
        eq(FLY.open, k, k + " opens its own picker, not another action");
      }
    } finally { FLY = null; box.remove(); txt.remove(); }
  });

  test("timer starts and stops", () => {
    timerStart(5, false);
    ok(TIMER_END > Date.now(), "TIMER_END not in the future");
    timerStop();
    eq(TIMER_END, 0);
  });

  test("#270 the dial: the angle is the minutes, outside the ring rings, the bell toggles", () => {
    const b = timerDialItem({label: "Timer"}), wasSound = TIMER_SOUND;
    b.style.cssText = "position:fixed;left:0;top:0";
    document.body.append(b);
    try {
      const box = b.querySelector(".tface").getBoundingClientRect(), R = box.width / 2;
      const cx = box.left + R, cy = box.top + R;
      // Left of the middle is a quarter of max, counter-clockwise from the top.
      const press = (x, y) => {
        for (const type of ["pointerdown", "pointerup"])
          b.querySelector(".tdial svg").dispatchEvent(new PointerEvent(type, {bubbles: true, clientX: x, clientY: y, pointerId: 1}));
      };
      const quarter = Math.round(timerMax() / 4) * 60000;
      press(cx - R * 0.4, cy);
      eq(TIMER_LEN, quarter, "inside: a quarter");
      eq(TIMER_SOUND, false, "inside the ring is silent");
      press(cx - R * 0.9, cy);
      eq(TIMER_LEN, quarter, "outside: the same quarter");
      eq(TIMER_SOUND, true, "outside the ring rings");
      const end = TIMER_END;
      b.querySelector('[data-part="sound"]').click();
      eq(TIMER_SOUND, false, "the bell turns it off");
      eq(TIMER_END, end, "and the time left is kept");
      b.querySelector('[data-part="sound"]').click();
      eq(TIMER_SOUND, true, "and on again");
      eq(TIMER_END, end);
      press(cx, cy);
      eq(TIMER_END, 0, "the middle stops it");
    } finally {
      b.remove(); timerStop(); TIMER_SOUND = wasSound;
    }
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
