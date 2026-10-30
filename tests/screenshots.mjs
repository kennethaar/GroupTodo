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
};
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
