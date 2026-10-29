/* The regression battery: does the app still do what it did?

       node tests/run.mjs            every test
       node tests/run.mjs parse      only tests whose name has "parse" in it

   It rebuilds docs/demo.html from grouptodo.html, opens it in a headless Edge
   (or Chrome) with a throwaway profile, waits for the app to finish starting,
   and runs tests/battery.js inside the page, where every app function is in
   reach. The demo keeps its vault in memory, so nothing here can touch a real
   vault. Exit code 0 when everything passed, 1 otherwise. See browser.mjs for
   how the browser is found and started.

   Needs Node 22+ (built-in fetch and WebSocket) and Python for the demo build. */
import {existsSync, readFileSync, readdirSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {openDemo, ROOT} from "./browser.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const only = process.argv[2] || "";

let exitCode = 1;
let app = null;
try {
  app = await openDemo();
  const {evaluate, pageErrors} = app;
  const bootErrors = pageErrors.splice(0);

  const battery = readFileSync(join(HERE, "battery.js"), "utf-8");
  const version = await evaluate("APP_VERSION");
  const results = await evaluate(battery + `\n;GTD_TEST.run(${JSON.stringify(only)})`);
  if (!only || "changelog".includes(only.toLowerCase())) {
    const log = readFileSync(join(ROOT, "CHANGELOG.md"), "utf-8");
    const top = (/^## (\d+\.\d+\.\d+)/m.exec(log) || [])[1];
    results.unshift(top === version
      ? {name: "CHANGELOG.md starts with this version", ok: true}
      : {name: "CHANGELOG.md starts with this version", ok: false,
         error: `APP_VERSION is ${version}, the newest CHANGELOG.md entry is ${top || "missing"}`});
  }
  /* Every screen the help shows a picture of has one, and no picture is left
     over from a topic that went. tests/screenshots.mjs makes them. */
  const shotsTest = "#171 every help screenshot is in docs/help, and none is left over";
  if (!only || shotsTest.toLowerCase().includes(only.toLowerCase())) {
    const want = await evaluate("Object.keys(HELP).filter(id => HELP[id].shot)");
    const dir = join(ROOT, "docs", "help");
    const have = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".jpg")).map(f => f.slice(0, -4)) : [];
    const missing = want.filter(id => !have.includes(id)), extra = have.filter(id => !want.includes(id));
    results.push(!missing.length && !extra.length
      ? {name: shotsTest, ok: true}
      : {name: shotsTest, ok: false,
         error: (missing.length ? "missing: " + missing.join(", ") + ". " : "") +
                (extra.length ? "no topic for: " + extra.join(", ") + ". " : "") + "Run node tests/screenshots.mjs"});
  }

  /* ---------- report ---------- */
  console.log(`\nGroupToDo v${version} - ${results.length} tests\n`);
  let failed = 0;
  for (const r of results) {
    if (r.ok) console.log("  ok    " + r.name);
    else { failed++; console.log("  FAIL  " + r.name + "\n          " + String(r.error).replace(/\n/g, "\n          ")); }
  }
  for (const [when, list] of [["while starting", bootErrors], ["during the tests", pageErrors]]) {
    if (!list.length) continue;
    failed++;
    console.log(`\n  FAIL  uncaught errors ${when}:`);
    for (const e of list) console.log("          " + String(e).split("\n")[0]);
  }
  console.log(`\n${results.length - results.filter(r => !r.ok).length} passed, ${failed} failed`);
  exitCode = failed ? 1 : 0;
} catch (e) {
  console.error(e.message || e);
} finally {
  if (app) await app.close();
}
process.exit(exitCode);
