/* The pictures in the help: one per screen, taken from the demo.

       node tests/screenshots.mjs            every topic with a picture
       node tests/screenshots.mjs next       only topics whose id has "next" in it

   Every help topic marked shot: 1 in grouptodo.html gets docs/help/<id>.jpg:
   its view, or what SETUP below opens for it, in the Paper theme at a laptop's
   size. Run it again whenever a screen or dialog the help shows changes, and
   commit the pictures with the change. The battery checks that every topic
   has its picture and that no picture is left over. */
import {mkdirSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {openDemo, ROOT, sleep} from "./browser.mjs";

const only = process.argv[2] || "";
const W = 1280, H = 800, SCALE = 0.75;

/* What to open for a topic that is not simply its view. Run in the page. */
const SETUP = {
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
      done("Clean the sink #15m [[c/home/bathroom]]", "Ingrid Solberg")]}, {silent: true});
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
};
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
SETUP["review-weeks"] = WEEK_PAGES + ` REVIEW_WEEK = 0; go("review", {sub: "weeks"});`;
/* Put back after the picture what SETUP added for it. */
const AFTER = {
  chores: `for (const p of CHORE_SHOT) V.pages.delete(p); clearMemo(); PREF.set("chores.who", ""); render();`,
  trackers: `for (const p of allPages(isJournalPath)) for (const k of TRK_SHOT.keys) delete getPage(p).props[k];
    for (const p of TRK_SHOT.made) V.pages.delete(p);
    for (const n of ["water", "coffee"]) V.pages.delete(trackerPagePath(n));
    clearMemo(); render();`,
  "review-reflect": `for (const [p, page] of REF_SHOT) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
    clearMemo(); render();`,
};
AFTER["journal-week"] = AFTER["review-weeks"] = `for (const [p, page] of WEEK_SHOT) if (page) putPage(p, page, {silent: true}); else V.pages.delete(p);
    clearMemo(); render();`;
// Only part of the screen, for a topic about one strip of it.
const CLIP = {topbar: {x: 0, y: 0, width: W, height: 140}};

const dir = join(ROOT, "docs", "help");
mkdirSync(dir, {recursive: true});
let app = null, code = 1;
try {
  app = await openDemo({width: W, height: H});
  const {evaluate, cdp} = app;
  await cdp("Emulation.setDeviceMetricsOverride", {width: W, height: H, deviceScaleFactor: 1, mobile: false});
  // The same light theme for every picture, whatever the machine prefers.
  await cdp("Emulation.setEmulatedMedia", {features: [{name: "prefers-color-scheme", value: "light"}]});
  await evaluate(`PREF.set("help.hints", "0"); setThemeSide("light"); true`);
  const topics = (await evaluate("Object.keys(HELP).filter(id => HELP[id].shot)")).filter(id => id.includes(only));
  if (!only) for (const f of readdirSync(dir)) if (f.endsWith(".jpg") && !topics.includes(f.slice(0, -4))) rmSync(join(dir, f));
  for (const id of topics) {
    await evaluate(`(() => {
      closeModal(); setHelp(false); helpMarks(false);
      document.querySelectorAll("#toasts > *, .helpsay, #helpHint").forEach(n => n.remove());
      const t = HELP[${JSON.stringify(id)}];
      ${SETUP[id] || `go(t.view, t.sub ? {sub: t.sub} : {});`}
      return true;
    })()`);
    await sleep(500);
    await evaluate(`document.querySelectorAll("#toasts > *").forEach(n => n.remove()); helpMarksDraw(); true`);
    await sleep(100);
    const clip = Object.assign({x: 0, y: 0, width: W, height: H}, CLIP[id] || {}, {scale: SCALE});
    const shot = await cdp("Page.captureScreenshot", {format: "jpeg", quality: 72, clip});
    writeFileSync(join(dir, id + ".jpg"), Buffer.from(shot.data, "base64"));
    console.log("  " + id + ".jpg");
    if (AFTER[id]) await evaluate(`(() => { ${AFTER[id]} return true; })()`);
  }
  await evaluate(`closeModal(); setHelp(false); true`);
  if (app.pageErrors.length) { console.error("errors in the page:\n" + app.pageErrors.join("\n")); }
  else code = 0;
} catch (e) {
  console.error(e.message || e);
} finally {
  if (app) await app.close();
}
process.exit(code);
