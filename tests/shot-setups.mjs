/* What to open for a help topic that is not simply its view, and what to put
   back afterwards. Each value is JavaScript run in the demo page.
   Shared by tests/screenshots.mjs (the help's pictures) and tests/ux-shot.mjs
   (the UX audit), so both see the same seeded screens and dialogs. */
export const SETUP = {
  start: `go("next", {sub: "board"}); setHelp(true); helpMarks(true);`,
  topbar: `go("today"); helpBeside("topbar"); helpMarks(true);`,
  vault: `go("today"); openVaultDialog();`,
  task: `go("next", {sub: "list"}); const a = nextActions()[0]; showTaskDetail(a.path, a.block, a.space);`,
  plan: `npmOpen(V.space, projectsIn("1")[0]); Object.assign(NPM, {step: 3, q: 0, last: [],
    comps: [{id: "a", name: "Mailing list", after: null, keep: [], act: {}}, {id: "b", name: "Template", after: null, keep: [], act: {}}],
    ideas: [["Export customer emails", "c:a"], ["Draft three subject lines", "c:b"], ["Translate it to Swedish", null], ["Check consent in the CRM", null]]
      .map(([t, to], i) => ({id: "i" + i, t, to}))}); render();`,
  // A few chores in two rooms, some of them somebody else's, gone again after the picture.
  chores: `const day = n => "[[" + shiftISO(todayISO(), n) + "]]";
    const chore = (t, repeat, n, props = {}) => stampAuthor(newBlock({state: "TODO", title: t, props: Object.assign({repeat, SCHEDULED: day(n)}, props)}));
    const done = (t, who) => stampAuthor(newBlock({state: "DONE", title: t, props: {repeat: "weekly", done_by: who + " " + todayISO() + "T12:00:00.000Z"}}));
    window.CHORE_SHOT = [join(DIRS.contexts, "home", "kitchen.md"), join(DIRS.contexts, "home", "bathroom.md")];
    putPage(CHORE_SHOT[0], {props: {title: "home/kitchen"}, blocks: [
      chore("Wipe the counters #15m [[c/home/kitchen]]", "daily", -2),
      chore("Empty the dishwasher [[c/home/kitchen]]", "daily", 0, {assigned: "Ingrid Solberg"}),
      chore("Clean the fridge #45m [[c/home/kitchen]]", "monthly", 9),
      done("Wipe the counters #15m [[c/home/kitchen]]", "Kenneth Aar"), done("Mop the floor #30m [[c/home/kitchen]]", "Ingrid Solberg"),
      done("Take out the bins [[c/home/kitchen]]", "Marcus Lind")]}, {silent: true});
    putPage(CHORE_SHOT[1], {props: {title: "home/bathroom"}, blocks: [
      chore("Scrub the shower #30m [[c/home/bathroom]]", "weekly", 3),
      chore("Change the towels [[c/home/bathroom]]", "weekly", -1, {assigned: "Marcus Lind"}),
      done("Clean the sink #15m [[c/home/bathroom]]", "Ingrid Solberg"),
      newBlock({title: "Laundry #30m [[c/home/bathroom]]", props: {repeat: "as needed"}}),
      newBlock({title: "Change the bed linen #15m [[c/home/bathroom]]", props: {repeat: "as needed"}}),
      done("Laundry #30m [[c/home/bathroom]]", "Marcus Lind"),
    ]}, {silent: true});
    getPage(CHORE_SHOT[1]).blocks.at(-1).props.repeat = "as needed"; // logged, not a weekly one
    clearMemo(); PREF.set("chores.who", "all"); go("chores");`,
  // Two weeks of water and coffee on one Drinks chart, and a weight of its own.
  trackers: `const w = [4,3,5,2,6,4,3,5,4,2,5,6,3,4], c = [2,3,1,3,2,2,4,1,2,3,2,1,3,2];
    window.TRK_SHOT = {made: [], keys: ["tracker-water_i", "tracker-coffee_i", "tracker-weight_k"]};
    for (let i = 0; i < 14; i++) {
      const p = journalPath(shiftISO(todayISO(), i - 13));
      if (!V.pages.has(p)) { putPage(p, {props: {}, blocks: []}, {silent: true}); TRK_SHOT.made.push(p); }
      Object.assign(getPage(p).props, {"tracker-water_i": "💧".repeat(w[i]), "tracker-coffee_i": "☕".repeat(c[i]),
        "tracker-weight_k": String(Math.round((81.4 - i * 0.15) * 10) / 10)});
    }
    clearMemo();
    setTrackerChart("water", "Drinks"); setTrackerChart("coffee", "Drinks");
    go("trackers");`,
  // Two intentions and three days of events and feelings, one of them picked.
  "review-reflect": `window.REF_SHOT = new Map([[INTENTIONS_PATH, null]].concat([2, 1, 0].map(n => [journalPath(shiftISO(todayISO(), -n)), null])));
    for (const p of REF_SHOT.keys()) REF_SHOT.set(p, V.pages.has(p) ? structuredClone(getPage(p)) : null);
    putPage(INTENTIONS_PATH, parsePage("type:: horizon\\n\\n- Protect deep-work energy\\n- Build a steady running habit\\n"), {silent: true});
    const day = (n, text) => putPage(journalPath(shiftISO(todayISO(), -n)), parsePage(text), {silent: true});
    day(2, "- o Budget meeting with [[p/Lars Haugen]]\\n  - = Drained, and annoyed that I said yes to more work\\n" +
      "  - I say yes before I have looked at my week\\n  - TODO Block Friday afternoons for my own projects\\n");
    day(1, "- o Ran 5 km with [[p/Ingrid Solberg]]\\n  - = Light, proud, warm in the body\\n");
    day(0, "- = Restless all morning, no clear reason\\n");
    clearMemo();
    setReflectPick(journalPath(shiftISO(todayISO(), -1)), getPage(journalPath(shiftISO(todayISO(), -1))).blocks[0], "toward");
    reflectionBlock(false).block.children.push(newBlock({title: "In bed by 22:30 on weekdays"}, false));
    clearMemo(); go("review", {sub: "reflect"});`,
  // Two day pages with loose lines, the first one dealt with a note under it (#95).
  "review-days": `window.DAY_SHOT = new Map([4, 2].map(n => [journalPath(shiftISO(todayISO(), -n)), null]));
    for (const p of DAY_SHOT.keys()) DAY_SHOT.set(p, V.pages.has(p) ? structuredClone(getPage(p)) : null);
    const day = (n, text) => putPage(journalPath(shiftISO(todayISO(), -n)), parsePage(text), {silent: true});
    day(4, "- Supplier meeting with [[p/Lars Haugen]]\\n  - New price list for the cold store before Christmas\\n" +
      "    - They want two quotes, ours and Havbris\\n- Idea: a shared tool shelf at the depot\\n");
    day(2, "- Ring the electrician about the gate\\n- Read up on heat pumps\\n");
    PREF.set("clarify.dealt", ""); CL = {pending: null, skip: new Set(), undo: null, aim: 0};
    clearMemo(); go("review", {sub: "days"});`,
};
/* A book of four chapters at three stages, with scenes, talk and a cast,
   gone again after the picture (#240, #243, #247). Each page is its lines.
   A book has an area of its own, so the demo's people step aside meanwhile:
   everybody on People is in the cast. */
const BOOK_SEED = `window.BOOK_SHOT = [BOOK_PATH, ...["The storm", "Harbour", "After the flood", "Coda"].map(t => join(PAGES, t + ".md")),
      ...["Anna Berg", "Mira Berg", "Jon Berg"].map(personPath), ...["The harbour", "The letter"].map(t => join(PAGES, t + ".md"))];
    window.BOOK_ASIDE = allPeople().filter(p => !isMemberPage(p)).map(p => [p, getPage(p)]);
    for (const [p] of BOOK_ASIDE) V.pages.delete(p);
    const para = n => Array.from({length: n}, () => "The water came up the road and nobody moved the cars.").join(" ");
    const put = (i, lines) => putPage(BOOK_SHOT[i], parsePage(lines.join(String.fromCharCode(10))), {silent: true});
    put(0, ["title:: The long road", "subtitle:: A novel", "synopsis:: Two sisters cross the hills to find their father, and the flood finds them first.",
      "target:: 80000", "dialogue:: english", "protagonist:: [[Anna Berg]]", "", "- [[The storm]]", "- [[Harbour]]", "- [[After the flood]]", "- [[Coda]]"]);
    put(1, ["stage:: Done", "synopsis:: The river breaks its banks.", "",
      "- ## The road", "  pov:: [[Anna Berg]]", "  with:: [[Mira Berg]]", "  when:: Day 1", "  plot:: The search, The flood", "- " + para(300),
      "- “We should go,” said Mira.", "- “Not yet.”", "- “Anna, the water.”",
      "- ## The bridge", "  pov:: [[Mira Berg]]", "  with:: [[Old Tomas]]", "  when:: Day 1, evening", "  plot:: The flood", "- " + para(80),
      "- “Is it safe?” Mira asked.", "- “Nothing is safe,” said Tomas. “Cross at the north end, where the rope is.”"]);
    put(2, ["stage:: Revise", "synopsis:: They wait out the night by the boats.", "", "- " + para(220),
      "- ## The quay", "  pov:: [[Anna Berg]]", "  place:: [[The harbour]]", "  when:: Day 3", "  plot:: The search, The letter", "- " + para(40),
      "- Anna found [[The letter]] in the boat.",
      "- Anna felt the cold and saw the river slowly rising over the stones while the dogs barked and the wind pulled at her coat and the long night came down over the valley and nobody in the town slept at all.",
      "- She realised the boats were gone. The boats had gone in the night.",
      "- ## Night watch", "  pov:: [[Mira Berg]]", "  with:: [[Jon Berg]]", "  when:: Day 3, night", "  plot:: The search", "- " + para(25),
      "- “You came,” said Jon.", "- “Of course I came. Tell me about the mill.”"]);
    put(3, ["stage:: Draft", "", "- " + para(90)]);
    put(4, ["stage:: Outline", "", "- ## Before the rain", "  pov:: [[Anna Berg]]", "  when:: Day 0, evening", "  plot:: The letter", "- %% They go home"]);
    put(5, ["type:: person", "wants:: To find her father", "arc:: From waiting to leading"]);
    put(6, ["type:: person", "wants:: To keep Anna safe", "sister:: [[Anna Berg]]"]);
    put(7, ["type:: person", "father:: [[Anna Berg]], [[Mira Berg]]"]);
    put(8, ["type:: place"]);
    put(9, ["type:: thing"]);
    clearMemo(); renderNav();`;
SETUP.book = BOOK_SEED + ` go("book", {sub: "chapters"});`;
SETUP["book-cast"] = BOOK_SEED + ` go("book", {sub: "cast"});`;
SETUP["book-relations"] = BOOK_SEED + ` go("book", {sub: "relations"});`;
SETUP["book-timeline"] = BOOK_SEED + ` go("book", {sub: "timeline"});`;
SETUP["book-plot"] = BOOK_SEED + ` go("book", {sub: "plot"});`;
SETUP["book-read"] = BOOK_SEED + ` go("book", {sub: "read"});`;
SETUP["book-revise"] = BOOK_SEED + ` REV.open = BOOK_SHOT[2]; go("book", {sub: "revise"});`;
/* This week's page with its routines and a focus line, and last week's with
   what was left open on it, gone again after the picture (#192). */
const WEEK_PAGES = `const wk = n => shiftWeek(weekOf(todayISO()), n);
    window.WEEK_SHOT = new Map([0, -1].map(n => [journalPath(wk(n)), null]));
    for (const p of WEEK_SHOT.keys()) WEEK_SHOT.set(p, V.pages.has(p) ? structuredClone(getPage(p)) : null);
    putPage(journalPath(wk(0)), parsePage("title:: " + wk(0) + "\\n\\n- DONE Water the plants every week [[c/home]]\\n" +
      "- TODO Back up the vault every week [[c/computer]]\\n- TODO Weekly review every week\\n" +
      "- TODO Book next week's site visits [[c/phone]]\\n- Focus: get the depot guide to [[p/Ingrid Solberg]] before the rollout\\n"), {silent: true});
    putPage(journalPath(wk(-1)), parsePage("title:: " + wk(-1) + "\\n\\n- TODO Send the board tax receipts\\n- DONE Water the plants every week\\n"), {silent: true});
    clearMemo();`;
SETUP["journal-week"] = WEEK_PAGES + ` go("today", {sub: "week", todayWeek: null});`;
// Get current opened, so the picture shows a part with its steps and lists (#95).
SETUP["review-steps"] = WEEK_PAGES + ` REVIEW_WEEK = 0; window.OPEN_SHOT = PREF.get("review.open", "");
    PREF.set("review.open", "phase:current"); go("review", {sub: "steps"});`;
// A home with two rooms in it and one still on its own, to show the stacking.
SETUP["contexts-sort"] = `window.CTX_SHOT = ["home", "home/kitchen", "home/garden", "kitchen table"].map(n => contextPath(n));
  for (const p of CTX_SHOT) putPage(p, pageTemplateFor("c", ctxNameOf(p)), {silent: true});
  clearMemo(); go("contexts", {sub: "sort"});`;
/* Put back after the picture what SETUP added for it. */
export const AFTER = {
  "contexts-sort": `for (const p of CTX_SHOT) V.pages.delete(p); clearMemo(); render();`,
  chores: `for (const p of CHORE_SHOT) V.pages.delete(p); clearMemo(); PREF.set("chores.who", ""); render();`,
  trackers: `for (const p of allPages(isJournalPath)) for (const k of TRK_SHOT.keys) delete getPage(p).props[k];
    for (const p of TRK_SHOT.made) V.pages.delete(p);
    for (const n of ["water", "coffee"]) V.pages.delete(trackerPagePath(n));
    clearMemo(); render();`,
  "review-reflect": `for (const [p, page] of REF_SHOT) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
    clearMemo(); render();`,
  "review-days": `for (const [p, page] of DAY_SHOT) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
    clearMemo(); render();`,
};
AFTER.book = AFTER["book-cast"] = AFTER["book-relations"] = AFTER["book-timeline"] = AFTER["book-plot"] = AFTER["book-read"] = AFTER["book-revise"] = `for (const p of BOOK_SHOT) V.pages.delete(p); REV.open = null;
    for (const [p, page] of BOOK_ASIDE) V.pages.set(p, page); PREF.set("sub.book", ""); clearMemo(); renderNav(); render();`;
AFTER["journal-week"] = AFTER["review-steps"] = `for (const [p, page] of WEEK_SHOT) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
    clearMemo(); render();`;
AFTER["review-steps"] = `PREF.set("review.open", OPEN_SHOT); ` + AFTER["review-steps"];
