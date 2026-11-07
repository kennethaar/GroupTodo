/* The UX audit's eyes: pictures of a screen and the checks a person would miss.

       node tests/ux-shot.mjs next-list                 a help topic's screen
       node tests/ux-shot.mjs vault task                several in one run
       node tests/ux-shot.mjs next-list --js "openLineMenu(...)"   then do this
       node tests/ux-shot.mjs --view today --sub week   a screen by its view

   For each one it writes, under $TMPDIR/grouptodo-claude/ux/<name>/:
     desktop.jpg  1280x800, Paper        phone.jpg  390x844, touch, Paper
     dark.jpg     1280x800, Ink          checks.json  what the checks found
   and prints a short summary. The screen is what tests/shot-setups.mjs opens
   for the topic, else its view. The demo is thrown away afterwards, so
   nothing needs putting back. Used by the ux-audit skill (.claude/skills). */
import {mkdirSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {openDemo, sleep} from "./browser.mjs";
import {SETUP} from "./shot-setups.mjs";

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const extraJs = opt("--js") || "", view = opt("--view"), sub = opt("--sub");
const ids = view ? [view + (sub ? "-" + sub : "")] : args;
if (!ids.length) { console.error("Name a help topic, or --view <view> [--sub <sub>]."); process.exit(2); }
const OUT = join(process.env.TMPDIR || tmpdir(), "grouptodo-claude", "ux");

/* Run in the page: everything visible that a person can act on or read. */
const CHECKS = `(() => {
  const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05
      && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; };
  const who = el => { const t = (el.getAttribute("aria-label") || el.title || el.textContent || el.value || "").trim().replace(/\\s+/g, " ");
    return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.classList.length ? "." + [...el.classList].slice(0, 2).join(".") : "")
      + (t ? " \\"" + t.slice(0, 40) + "\\"" : ""); };
  const ACT = "button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=menuitem], [role=checkbox], [contenteditable=true], [tabindex]:not([tabindex='-1'])";
  const acts = [...document.querySelectorAll(ACT)].filter(vis);
  const name = el => (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.title
    || el.textContent.trim() || el.placeholder || el.value || (el.labels && el.labels.length) || el.querySelector("img[alt]")) ? 1 : 0;
  const smallTargets = acts.filter(el => { if (el.matches("[contenteditable=true], textarea")) return false;
    const r = el.getBoundingClientRect(); return r.width < 24 || r.height < 24; });
  const unnamed = acts.filter(el => !name(el) && !el.matches("[contenteditable=true]"));
  const fakeButtons = [...document.querySelectorAll("[tabindex]:not(button):not(a):not(input):not(select):not(textarea):not(summary):not([contenteditable])")].filter(vis);
  /* Contrast of text against the first solid background behind it. */
  const rgb = c => { const m = c.match(/rgba?\\(([^)]+)\\)/) || c.match(/color\\(srgb ([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); const scale = c.startsWith("color(") ? 255 : 1;
    return {r: p[0] * scale, g: p[1] * scale, b: p[2] * scale, a: p.length > 3 ? p[3] : 1}; };
  const lum = ({r, g, b}) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bgOf = el => { for (let n = el; n; n = n.parentElement) { const s = getComputedStyle(n);
      if (s.backgroundImage !== "none") return null; const c = rgb(s.backgroundColor); if (c && c.a > 0.9) return c; }
    return rgb(getComputedStyle(document.body).backgroundColor); };
  const lowContrast = [], tinyText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t; (t = walker.nextNode());) {
    const el = t.parentElement; if (!el || seen.has(el) || !t.textContent.trim() || !vis(el)) continue; seen.add(el);
    const s = getComputedStyle(el), size = parseFloat(s.fontSize);
    if (size < 12) tinyText.push(who(el) + " " + size + "px");
    const fg = rgb(s.color), bg = bgOf(el); if (!fg || !bg || el.closest("svg")) continue;
    const a = fg.a * (+s.opacity || 1);
    const mix = {r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a)};
    const [hi, lo] = [lum(mix), lum(bg)].sort((x, y) => y - x), ratio = (hi + 0.05) / (lo + 0.05);
    const large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
    if (ratio < (large ? 3 : 4.5) && !el.closest("[disabled], [aria-disabled=true]")) lowContrast.push(who(el) + " " + ratio.toFixed(2));
  }
  const se = document.scrollingElement;
  const wide = [...document.querySelectorAll("body *")].filter(el => { const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > innerWidth + 2 && getComputedStyle(el).position !== "fixed" && !el.closest("[style*=overflow], .scroll"); });
  const top = (list, n = 12) => ({count: list.length, examples: list.slice(0, n).map(x => typeof x === "string" ? x : who(x))});
  return {
    viewport: innerWidth + "x" + innerHeight,
    controls: acts.length,
    pageScrollsSideways: se.scrollWidth > innerWidth + 2,
    smallTargets: top(smallTargets), unnamed: top(unnamed), tabindexOnNonInteractive: top(fakeButtons),
    lowContrast: top(lowContrast), tinyText: top(tinyText), widerThanScreen: top(wide, 6),
  };
})()`;

const MODES = [
  {name: "desktop", w: 1280, h: 800, mobile: false, side: "light"},
  {name: "phone", w: 390, h: 844, mobile: true, side: "light"},
  {name: "dark", w: 1280, h: 800, mobile: false, side: "dark"},
];

let app = null, code = 1;
try {
  app = await openDemo({width: 1280, height: 800});
  const {evaluate, cdp} = app;
  await evaluate(`PREF.set("help.hints", "0"); true`);
  for (const id of ids) {
    const open = view ? `go(${JSON.stringify(view)}, ${sub ? JSON.stringify({sub}) : "{}"});`
      : SETUP[id] || `(() => { const t = HELP[${JSON.stringify(id)}]; if (!t) throw new Error("no help topic ${id}");
          go(t.view || "today", t.sub ? {sub: t.sub} : {}); })();`;
    const dir = join(OUT, id);
    mkdirSync(dir, {recursive: true});
    const report = {id, pageErrors: []};
    let opened = false;
    for (const m of MODES) {
      await cdp("Emulation.setDeviceMetricsOverride", {width: m.w, height: m.h, deviceScaleFactor: 1, mobile: m.mobile});
      await cdp("Emulation.setTouchEmulationEnabled", {enabled: m.mobile});
      await cdp("Emulation.setEmulatedMedia", {features: [{name: "prefers-color-scheme", value: m.side}]});
      await evaluate(`setThemeSide(${JSON.stringify(m.side)}); true`);
      if (!opened) {
        await evaluate(`(() => { closeModal(); setHelp(false); helpMarks(false);
          document.querySelectorAll("#toasts > *, .helpsay, #helpHint").forEach(n => n.remove());
          ${open} ${extraJs}; return true; })()`);
        opened = true;
      } else await evaluate(`render(); true`);
      await sleep(600);
      await evaluate(`document.querySelectorAll("#toasts > *").forEach(n => n.remove()); true`);
      const shot = await cdp("Page.captureScreenshot", {format: "jpeg", quality: 75});
      writeFileSync(join(dir, m.name + ".jpg"), Buffer.from(shot.data, "base64"));
      report[m.name] = await evaluate(CHECKS);
    }
    report.pageErrors = app.pageErrors.splice(0);
    writeFileSync(join(dir, "checks.json"), JSON.stringify(report, null, 2));
    const line = k => MODES.map(m => m.name + " " + report[m.name][k].count).join(", ");
    console.log(`\n${id}  →  ${dir}`);
    console.log(`  controls: ${MODES.map(m => m.name + " " + report[m.name].controls).join(", ")}`);
    for (const k of ["smallTargets", "unnamed", "tabindexOnNonInteractive", "lowContrast", "tinyText"]) console.log(`  ${k}: ${line(k)}`);
    console.log(`  phone scrolls sideways: ${report.phone.pageScrollsSideways}`);
    if (report.pageErrors.length) console.log("  PAGE ERRORS:\n    " + report.pageErrors.join("\n    "));
  }
  code = 0;
} catch (e) {
  console.error(e.message || e);
} finally {
  if (app) await app.close();
}
process.exit(code);
