/* The demo in a headless Edge or Chrome, driven over the DevTools protocol.
   Shared by the regression battery (run.mjs) and the help's screenshots
   (screenshots.mjs), so both see the app the same way.

   openDemo() rebuilds docs/demo.html from grouptodo.html (after copying the
   newest CHANGELOG.md entries into the help), starts a browser with a
   throwaway profile, opens the demo and waits for the app to finish starting.
   Needs Node 22+ (built-in fetch and WebSocket) and Python for the builds. */
import {spawn, spawnSync} from "node:child_process";
import {existsSync, mkdtempSync, readdirSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- the demo, fresh from the app ----------
   What's new in the help is copied from CHANGELOG.md first, so the version
   that is pushed carries its own news. */
function buildDemo() {
  for (const script of ["build-help-news.py", "build-demo.py"]) {
    for (const py of ["python", "py", "python3"]) {
      const r = spawnSync(py, [join(ROOT, "docs", script)], {encoding: "utf-8"});
      if (r.error) continue;
      if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
      break;
    }
  }
  return join(ROOT, "docs", "demo.html");
}

/* ---------- a browser ---------- */
// A cloud session has no Edge or Chrome, only the Chromium that Playwright
// installed, newest version last.
function playwrightChromium() {
  const dir = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  let names;
  try { names = readdirSync(dir).filter(n => /^chromium-\d+$/.test(n)); } catch { return []; }
  names.sort((a, b) => b.split("-")[1] - a.split("-")[1]);
  return names.flatMap(n => ["chrome-linux64", "chrome-linux"].map(d => join(dir, n, d, "chrome")));
}
const BROWSERS = [
  process.env.GTD_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/microsoft-edge", "/usr/bin/google-chrome", "/usr/bin/chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ...playwrightChromium(),
].filter(Boolean);

/* The demo open and started. Returns {evaluate, cdp, pageErrors, close}. */
export async function openDemo({width = 1400, height = 900} = {}) {
  const demo = buildDemo();
  const exe = BROWSERS.find(p => existsSync(p));
  if (!exe) { console.error("No Edge or Chrome found. Set GTD_BROWSER to its path."); process.exit(1); }

  const profile = mkdtempSync(join(tmpdir(), "gtd-tests-"));
  const port = 9300 + Math.floor(Math.random() * 500);
  const browser = spawn(exe, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--remote-debugging-port=" + port, "--user-data-dir=" + profile,
    "--window-size=" + width + "," + height,
    // A headless browser with no mouse plugged in can read as a touch screen
    // (hover:none), which always shows the upkeep that waits for the pointer.
    // Test as a desktop with a mouse, wherever it runs.
    "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
    // Chromium will not start as root with its sandbox on, and a cloud session runs as root.
    ...(process.platform === "linux" && process.getuid && process.getuid() === 0 ? ["--no-sandbox"] : []),
    "about:blank",
  ], {stdio: "ignore"});
  let ws = null;
  const close = async () => {
    try { ws && ws.close(); } catch { /* already gone */ }
    browser.kill();
    await sleep(300);
    try { rmSync(profile, {recursive: true, force: true}); } catch { /* Edge may still hold it */ }
  };
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
    ws = new WebSocket(target.webSocketDebuggerUrl);
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
    return {evaluate, cdp, pageErrors, close};
  } catch (e) {
    await close();
    throw e;
  }
}
