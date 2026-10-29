/* The regression battery: does the app still do what it did?

       node tests/run.mjs            every test
       node tests/run.mjs parse      only tests whose name has "parse" in it

   It rebuilds docs/demo.html from grouptodo.html, opens it in a headless Edge
   (or Chrome) with a throwaway profile, waits for the app to finish starting,
   and runs tests/battery.js inside the page, where every app function is in
   reach. The demo keeps its vault in memory, so nothing here can touch a real
   vault. Exit code 0 when everything passed, 1 otherwise.

   Needs Node 22+ (built-in fetch and WebSocket) and Python for the demo build. */
import {spawn, spawnSync} from "node:child_process";
import {existsSync, mkdtempSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const only = process.argv[2] || "";

/* ---------- the demo, fresh from the app ---------- */
for (const py of ["python", "py", "python3"]) {
  const r = spawnSync(py, [join(ROOT, "docs", "build-demo.py")], {encoding: "utf-8"});
  if (r.error) continue;
  if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
  break;
}
const demo = join(ROOT, "docs", "demo.html");

/* ---------- a browser ---------- */
const BROWSERS = [
  process.env.GTD_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/microsoft-edge", "/usr/bin/google-chrome", "/usr/bin/chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const exe = BROWSERS.find(p => existsSync(p));
if (!exe) { console.error("No Edge or Chrome found. Set GTD_BROWSER to its path."); process.exit(1); }

const profile = mkdtempSync(join(tmpdir(), "gtd-tests-"));
const port = 9300 + Math.floor(Math.random() * 500);
const browser = spawn(exe, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--remote-debugging-port=" + port, "--user-data-dir=" + profile,
  "--window-size=1400,900",
  // A headless browser with no mouse plugged in can read as a touch screen
  // (hover:none), which always shows the upkeep that waits for the pointer.
  // Test as a desktop with a mouse, wherever it runs.
  "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
  "about:blank",
], {stdio: "ignore"});

const sleep = ms => new Promise(r => setTimeout(r, ms));
let exitCode = 1;
try {
  let target;
  for (let i = 0; i < 100 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find(t => t.type === "page");
    } catch { /* not listening yet */ }
    if (!target) await sleep(100);
  }
  if (!target) throw new Error("the browser did not start");

  /* ---------- a small CDP client ---------- */
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, bad) => { ws.onopen = ok; ws.onerror = bad; });
  let seq = 0;
  const waiting = new Map();
  const pageErrors = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && waiting.has(m.id)) {
      const {ok, bad} = waiting.get(m.id);
      waiting.delete(m.id);
      m.error ? bad(new Error(m.error.message)) : ok(m.result);
    } else if (m.method === "Runtime.exceptionThrown") {
      const d = m.params.exceptionDetails;
      pageErrors.push((d.exception && d.exception.description) || d.text);
    }
  };
  const cdp = (method, params = {}) => new Promise((ok, bad) => {
    const id = ++seq;
    waiting.set(id, {ok, bad});
    ws.send(JSON.stringify({id, method, params}));
  });
  const evaluate = async (expression, timeout = 120000) => {
    const r = await cdp("Runtime.evaluate", {expression, awaitPromise: true, returnByValue: true, timeout});
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error((d.exception && d.exception.description) || d.text);
    }
    return r.result.value;
  };

  await cdp("Runtime.enable");
  await cdp("Page.enable");
  // A headless window never has the focus, so a line's focus and blur would not fire.
  await cdp("Emulation.setFocusEmulationEnabled", {enabled: true});
  await cdp("Page.navigate", {url: pathToFileURL(demo).href});

  let ready = false;
  for (let i = 0; i < 300 && !ready; i++) {
    await sleep(100);
    try { ready = await evaluate("typeof INIT_DONE !== 'undefined' && INIT_DONE && V.loaded"); } catch { /* still loading */ }
  }
  if (!ready) throw new Error("the app did not finish starting\n" + pageErrors.join("\n"));
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
  ws.close();
} catch (e) {
  console.error(e.message || e);
} finally {
  browser.kill();
  await sleep(300);
  try { rmSync(profile, {recursive: true, force: true}); } catch { /* Edge may still hold it */ }
}
process.exit(exitCode);
