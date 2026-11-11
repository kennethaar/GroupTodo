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
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
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
  /* The service worker runs in no page, so it is run here, in a sandbox with a
     network that never answers and a kept copy of the app. */
  const swTest = "#228 the service worker opens its kept copy when the network hangs";
  if (!only || swTest.toLowerCase().includes(only.toLowerCase())) {
    results.push(await serviceWorkerTest(swTest));
  }
  /* The importer is its own page; its pure half is run here. */
  const importTest = "#288 the importer asks what PR/A, &/, #/, @, a first-line #tag and status:: mean, and writes into the area";
  if (!only || importTest.toLowerCase().includes(only.toLowerCase())) {
    results.push(await importerTest(importTest));
  }
  const serveTest = "#228 serve.py answers an unchanged app with 304, and gzips it";
  if (!only || serveTest.toLowerCase().includes(only.toLowerCase())) {
    results.push(await serveCacheTest(serveTest));
  }
  const serveLogTest = "#355 serve.py starts with a box, logs to a file of at most 500 lines, and never shows a calendar link in full";
  if (!only || serveLogTest.toLowerCase().includes(only.toLowerCase())) {
    results.push(await serveLogTestRun(serveLogTest));
  }

  const stripTest = "#259 the build takes out comments and indentation and nothing else";
  if (!only || stripTest.toLowerCase().includes(only.toLowerCase())) {
    results.push(await stripBuildTest(stripTest));
  }

  /* Examples are made up. The real names they replaced are kept out by their
     hashes, so this test does not repeat them (#286). */
  const namesTest = "#286 examples use made-up names and work, not real ones";
  if (!only || namesTest.toLowerCase().includes(only.toLowerCase())) {
    const BANNED = new Set(["b8f46005bc568403", "c0f2eda8a1fb7fb0", "078b217927e73bc4", "c4c4e84c9bc3137d",
      "95a7d3389112ab19", "a7843d403be47ee2", "3436d74d54ce795a", "c5668d09aed9281b", "dc60c1479f41fcfd",
      "981c7e6b7f4e65cd", "97315cbd8688e5d9", "e6b8083ba1fd0b4f", "9a11dc7a235cdc26", "f06f9ef3650cf04e",
      "9b57b544cc50ae5c"]);
    const hash = w => createHash("sha256").update(w).digest("hex").slice(0, 16);
    const hits = [];
    const files = execFileSync("git", ["ls-files"], {cwd: ROOT, encoding: "utf-8"}).split("\n")
      .filter(f => /\.(html|js|mjs|md|txt|css|py|json|svg)$/.test(f));
    for (const f of files) {
      if (!existsSync(join(ROOT, f))) continue;
      const words = readFileSync(join(ROOT, f), "utf-8").toLowerCase().match(/\p{L}+/gu) || [];
      for (let i = 0; i < words.length; i++)
        if (BANNED.has(hash(words[i])) || (i && BANNED.has(hash(words[i - 1] + " " + words[i])))) {
          hits.push(f + " (word " + (i + 1) + ")");
          break;
        }
    }
    results.push(!hits.length ? {name: namesTest, ok: true}
      : {name: namesTest, ok: false, error: "a real name or project is back in: " + hits.join(", ")});
  }

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

async function serviceWorkerTest(name) {
  const {runInNewContext} = await import("node:vm");
  const listeners = {};
  const kept = new Response("kept copy");
  let waited = null;
  const self = {
    location: new URL("http://host/app/sw.js"),
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: async () => {}, clients: {claim: async () => {}},
  };
  const caches = {
    match: async () => kept.clone(),
    open: async () => ({put: async () => {}, add: async () => {}}),
    keys: async () => [],
  };
  const timers = [];
  const sandbox = {self, caches, URL, Response, Promise,
    fetch: () => new Promise(() => {}),                          // a network that never answers
    setTimeout: (fn, ms, ...a) => { timers.push(ms); return setTimeout(fn, Math.min(ms, 50), ...a); }};
  try {
    runInNewContext(readFileSync(join(ROOT, "sw.js"), "utf-8"), sandbox);
    let answer = null;
    listeners.fetch({
      request: {url: "http://host/app/grouptodo.html", method: "GET", mode: "navigate"},
      respondWith: p => { answer = p; },
      waitUntil: p => { waited = p; },
    });
    if (!answer) return {name, ok: false, error: "the worker did not answer the app's own page"};
    const r = await Promise.race([answer, new Promise(res => setTimeout(res, 2000, null))]);
    if (!r) return {name, ok: false, error: "still waiting for the network after 2 s (sandbox time)"};
    if (await r.text() !== "kept copy") return {name, ok: false, error: "answered with something other than the kept copy"};
    if (!timers.some(ms => ms >= 1000 && ms <= 5000)) return {name, ok: false, error: "no 1-5 s limit on the network: " + timers.join(", ")};
    if (!waited) return {name, ok: false, error: "the download is not kept alive to update the copy"};
    return {name, ok: true};
  } catch (e) { return {name, ok: false, error: String(e && e.stack || e)}; }
}

async function importerTest(name, file = join(ROOT, "GroupToDo-Importer.html")) {
  const {runInNewContext} = await import("node:vm");
  try {
    const src = readFileSync(file, "utf-8").split("<script>")[1].split("/* ---------- the page")[0]
      .split("window.GTDImport =")[0] + ";this.G = {analyze, ruleChoices, convert, startRules, outlineFiles};";
    const box = {};
    runInNewContext(src, box);
    const G = box.G;
    const files = [
      ["pages/PR%2FA%2FNew kitchen.md", "- TODO Call [[&/Anna Berg]] @computer #Work [[#/Acme]]\n- see [[PR/X/Old shed]]"],
      ["pages/PR%2FX%2FOld shed.md", "- DONE paint"],
      ["pages/PR%2FC%2FDropped.md", "- idea"],
      ["pages/&%2FAnna Berg.md", "- hi"],
      ["pages/#%2FAcme.md", "- supplier"],
    ].map(([rel, text]) => ({rel, text, mtime: 0}));
    const a = G.analyze("logseq", files);
    // Nobody's naming is assumed: every namespace starts unanswered.
    const rules = G.startRules(G.ruleChoices(a));
    const preset = Object.entries(rules.groups).filter(([k, v]) => k && v);
    if (preset.length) return {name, ok: false, error: "chosen before the user was asked: " + JSON.stringify(preset)};
    // The user's own answers.
    Object.assign(rules.groups, {"PR/A": "1", "PR/X": "0", "PR/C": "-", "&": "p", "#": "o"});
    const out = G.convert(a, {me: "Me", area: "Work", rules, atContext: true}).files;
    const want = ["Work/pages/1/New kitchen.md", "Work/pages/0/Old shed.md", "Work/pages/-/Dropped.md",
      "Work/pages/p/Anna Berg.md", "Work/pages/o/Acme.md", "Work/pages/c/computer.md"];
    const missing = want.filter(w => !out.has(w));
    if (missing.length) return {name, ok: false, error: "missing " + missing.join(", ") + "; got " + [...out.keys()].join(", ")};
    const line = (out.get("Work/pages/1/New kitchen.md") || "");
    for (const s of ["[[p/Anna Berg]]", "[[c/computer]]", "#Work", "[[o/Acme]]", "[[0/Old shed]]", "status:: 1 = active"])
      if (!line.includes(s)) return {name, ok: false, error: "the project page lacks " + s + ":\n" + line};
    // A page says what it is with #Active on its first line, in front matter
    // or as status:: Active; each is a row the user can give a meaning.
    for (const [kind, pages] of [
      ["logseq", [["pages/Roof.md", "- #Active\n- fix it"], ["pages/Shed.md", "status:: Active\n\n- paint"],
        ["pages/Barn.md", "- one\n- a task #Active"]]],
      ["obsidian", [["Roof.md", "#Active\n\n- fix it"], ["Shed.md", "---\nstatus: Active\n---\npaint"],
        ["Barn.md", "one\n\n- a task #Active"]]]]) {
      const b = G.analyze(kind, pages.map(([rel, text]) => ({rel, text, mtime: 0})));
      const r = G.startRules(G.ruleChoices(b));
      if (!("active" in r.tags) || !("status: active" in r.tags))
        return {name, ok: false, error: kind + ": no row for #Active or status: Active; rows " + Object.keys(r.tags).join(", ")};
      r.tags.active = "1"; r.tags["status: active"] = "1";
      const got = [...G.convert(b, {me: "Me", rules: r}).files.keys()];
      for (const w of ["pages/1/Roof.md", "pages/1/Shed.md", "pages/Barn.md"])
        if (!got.includes(w)) return {name, ok: false, error: kind + ": expected " + w + "; got " + got.join(", ")};
    }
    // Every kind of page GroupToDo has can be chosen: purpose and vision are
    // one page each, so two vision pages become one, each under its old title.
    const h = G.analyze("logseq", [["pages/Why%2FMission.md", "- serve"], ["pages/Future%2F2030.md", "- bigger"],
      ["pages/Future%2F2032.md", "- calmer"], ["pages/Mail%2FQuote.md", "- hello"], ["pages/Books%2FGTD.md", "- 5 stars"]]
      .map(([rel, text]) => ({rel, text, mtime: 0})));
    const hr = G.startRules(G.ruleChoices(h));
    Object.assign(hr.groups, {Why: "h5", Future: "h4", Mail: "m", Books: "r"});
    const hf = G.convert(h, {me: "Me", rules: hr}).files;
    for (const w of ["pages/_/Purpose.md", "pages/_/Vision.md", "pages/m/Quote.md", "pages/r/GTD.md"])
      if (!hf.has(w)) return {name, ok: false, error: "expected " + w + "; got " + [...hf.keys()].join(", ")};
    // Dynalist and Workflowy export OPML: each document is a page, a folder is
    // a namespace, a checkbox or checkmark is a task, a note stays under its line.
    const opml = '<?xml version="1.0"?><opml version="2.0"><head><title>Trip</title><flavor>dynalist</flavor></head><body>' +
      '<outline text="**Plan** the trip" heading="2" _note="Line one&#xD;&#xA;Line two"><outline text="Book tickets !(2026-12-01)" checkbox="true"/>' +
      '<outline text="Pack" checkbox="true" complete="true"/><outline text="Ask [[Anna]] &amp; Bo !(2026-11-30)"/></outline></body></opml>';
    const o = G.outlineFiles([{rel: "Someday _ Maybe/Trip.opml", text: opml}, {rel: "Someday _ Maybe/Trip.txt", text: "dup"},
      {rel: "Ideas.txt", text: "- Buy milk\n    - Whole\n- Call Bo"}].map(f => ({mtime: 0, ...f})));
    if (o.origin !== "Dynalist" || o.files.length !== 2) return {name, ok: false, error: "outline files: " + o.origin + " " + o.files.map(f => f.rel)};
    const oa = G.analyze("logseq", o.files);
    const orules = G.startRules(G.ruleChoices(oa));
    orules.groups["Someday _ Maybe"] = "2";
    const oo = G.convert(oa, {me: "Me", area: "Work", rules: orules}).files;
    const trip = oo.get("Work/pages/2/Trip.md") || "";
    for (const s of ["- ## **Plan** the trip", "  Line one", "  Line two", "  - TODO Book tickets", "DEADLINE:: [[2026-12-01]]",
      "  - DONE Pack", "Ask [[Anna]] & Bo [[2026-11-30]]"])
      if (!trip.includes(s)) return {name, ok: false, error: "the OPML page lacks " + s + ":\n" + trip};
    const ideas = oo.get("Work/pages/Ideas.md") || "";
    if (!/- Buy milk\n {2}- Whole\n- Call Bo/.test(ideas)) return {name, ok: false, error: "the text outline lost its shape:\n" + ideas};
    const vision = hf.get("pages/_/Vision.md");
    if (!/type:: horizon/.test(vision) || !/^- 2030\n {2}- bigger/m.test(vision) || !/^- 2032\n {2}- calmer/m.test(vision))
      return {name, ok: false, error: "the vision page lost a source or its title:\n" + vision};
    return {name, ok: true};
  } catch (e) { return {name, ok: false, error: String(e && e.stack || e)}; }
}

async function serveCacheTest(name) {
  const {spawn} = await import("node:child_process");
  const port = 18000 + Math.floor(Math.random() * 2000);
  const py = process.platform === "win32" ? "python" : "python3";
  const {tmpdir} = await import("node:os");
  const server = spawn(py, [join(ROOT, "serve.py"), "--port", String(port), "--calendars-only",
    "--log-file", join(tmpdir(), "gtd-serve-test.log")], {stdio: "ignore"});
  const url = `http://127.0.0.1:${port}/grouptodo.html`;
  try {
    /* Plain http, not fetch: Node 24's fetch can fail an internal assert,
       outside any catch, on a connection serve.py closes. */
    const {get} = await import("node:http");
    const ask = headers => new Promise(ok => get(url, {headers, agent: false}, res => {
      res.resume(); res.on("end", () => ok(res));
    }).on("error", () => ok(null)));
    let first = null;
    for (let i = 0; i < 50 && !first; i++) if (!(first = await ask({"Accept-Encoding": "gzip"}))) await new Promise(r => setTimeout(r, 100));
    if (!first) return {name, ok: false, error: "serve.py did not start"};
    if (first.headers["content-encoding"] !== "gzip") return {name, ok: false, error: "not gzipped"};
    const tag = first.headers.etag;
    if (!tag) return {name, ok: false, error: "no ETag"};
    const again = await ask({"If-None-Match": tag});
    if (!again || again.statusCode !== 304) return {name, ok: false, error: "unchanged file answered " + (again && again.statusCode)};
    return {name, ok: true};
  } catch (e) { return {name, ok: false, error: String(e)}; }
  finally { server.kill(); }
}

/* A calendar link is a password to that calendar: the terminal and the log
   show its first 15 and last 5 characters only. Request lines go to the log,
   not the terminal; a failure shows in both. The log keeps 500 lines and one
   older file. */
async function serveLogTestRun(name) {
  const {spawn} = await import("node:child_process");
  const {mkdtempSync, writeFileSync, rmSync} = await import("node:fs");
  const {tmpdir} = await import("node:os");
  const dir = mkdtempSync(join(tmpdir(), "gtd-log-"));
  const log = join(dir, "grouptodo.log");
  writeFileSync(log, Array.from({length: 499}, (_, i) => "old line " + i + "\n").join(""));
  const port = 18000 + Math.floor(Math.random() * 2000);
  const py = process.platform === "win32" ? "python" : "python3";
  const server = spawn(py, [join(ROOT, "serve.py"), "--port", String(port), "--calendars-only", "--log-file", log]);
  let out = "";
  server.stdout.on("data", d => out += d.toString("utf-8"));
  server.stderr.on("data", d => out += d.toString("utf-8"));
  const secret = "https://cal.example.invalid/secret-token-1234567890/calendar.ics";
  const {get} = await import("node:http");
  const ask = path => new Promise(ok => get(`http://127.0.0.1:${port}${path}`, {agent: false}, res => {
    res.resume(); res.on("end", () => ok(res));
  }).on("error", () => ok(null)));
  try {
    let up = null;
    for (let i = 0; i < 50 && !up; i++) if (!(up = await ask("/api/ping"))) await new Promise(r => setTimeout(r, 100));
    if (!up) return {name, ok: false, error: "serve.py did not start:\n" + out};
    const cal = await ask("/api/calendar?url=" + encodeURIComponent(secret));
    if (!cal || cal.statusCode !== 400) return {name, ok: false, error: "the calendar answered " + (cal && cal.statusCode)};
    await new Promise(r => setTimeout(r, 400));
    const short = "https://cal.exa…r.ics";
    if (!/GroupToDo started/.test(out) || !out.includes(`Go to`) || !out.includes(`http://127.0.0.1:${port}/`) || !out.includes(log))
      return {name, ok: false, error: "the start box lacks the address or the log:\n" + out};
    if (!/[┌╭]/.test(out)) return {name, ok: false, error: "no box:\n" + out};
    if (/GET \/api\/ping/.test(out)) return {name, ok: false, error: "request lines still go to the terminal:\n" + out};
    if (!out.split("\n").some(l => l.startsWith("!") && l.includes(short)))
      return {name, ok: false, error: "the failed calendar is not an ! line with the short link:\n" + out};
    const now = readFileSync(log, "utf-8"), old = existsSync(log + ".1") ? readFileSync(log + ".1", "utf-8") : "";
    if (/secret-token/.test(out + now + old)) return {name, ok: false, error: "the calendar link shows in full"};
    if (!old.startsWith("old line 0")) return {name, ok: false, error: "the log did not rotate at 500 lines"};
    if (old.trimEnd().split("\n").length !== 500) return {name, ok: false, error: "the old log has " + old.trimEnd().split("\n").length + " lines"};
    if (!now.includes("/api/calendar") || !now.includes(short)) return {name, ok: false, error: "the log lacks the calendar request:\n" + now};
    if (readdirSync(dir).length !== 2) return {name, ok: false, error: "more than one old log: " + readdirSync(dir)};
    return {name, ok: true};
  } catch (e) { return {name, ok: false, error: String(e)}; }
  finally { server.kill(); setTimeout(() => { try { rmSync(dir, {recursive: true, force: true}); } catch {} }, 500); }
}

async function stripBuildTest(name) {
  const {stripJs, stripCss, stripHtml} = await import("../strip.mjs");
  const {Script} = await import("node:vm");
  const cases = [
    ["a comment and the indentation go", "  // note\n  const a = 1;   /* x */\n\n    b();  \n", "const a = 1;\nb();\n"],
    ["// and /* inside strings stay", 'const u = "http://x/*y*/"; const v = \'//\';\n', 'const u = "http://x/*y*/"; const v = \'//\';\n'],
    ["a regex holding // and /* stays", "const r = /\\/\\/|\\/\\*|[/*]/g;  // c\n", "const r = /\\/\\/|\\/\\*|[/*]/g;\n"],
    ["a division is not a regex", "const h = (a + b) / 2 / 3; // c\n", "const h = (a + b) / 2 / 3;\n"],
    ["a template keeps its lines and its indentation", "const t = `a\n    // not a comment\n  ${x ? `i\n  j` : \"}\"} /* k */\n`;\n  f();\n", "const t = `a\n    // not a comment\n  ${x ? `i\n  j` : \"}\"} /* k */\n`;\nf();\n"],
    ["a string continued over a line keeps its indentation", 'const s = "a\\\n   b";\n', 'const s = "a\\\n   b";\n'],
    ["the line break that ends a statement stays", "let a = 1\n  /* c */\nlet b = 2\n", "let a = 1\nlet b = 2\n"],
  ];
  for (const [what, from, want] of cases) {
    const got = stripJs(from);
    if (got !== want) return {name, ok: false, error: what + ": " + JSON.stringify(got) + " is not " + JSON.stringify(want)};
  }
  const css = stripCss("/* c */\n.a {\n  color: red; /* d */\n  content: \"/* e */\";\n}\n");
  if (css !== '.a {\ncolor: red;\ncontent: "/* e */";\n}\n') return {name, ok: false, error: "css: " + JSON.stringify(css)};
  if (stripHtml("<!-- c -->\n<div>\n  <!--@css-->\n</div>\n") !== "<div>\n<!--@css-->\n</div>\n") return {name, ok: false, error: "html"};
  /* The file that ships: every script still compiles. */
  const app = readFileSync(join(ROOT, "grouptodo.html"), "utf-8");
  const blocks = [...app.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)].map(m => m[1]);
  if (blocks.length !== 6) return {name, ok: false, error: blocks.length + " scripts, not 6"};
  try { blocks.forEach((b, i) => new Script(b, {filename: "script" + (i + 1)})); }
  catch (e) { return {name, ok: false, error: String(e)}; }
  return {name, ok: true};
}
