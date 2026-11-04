/* Builds grouptodo.html, the one file the app ships as, from src/.

       node build.mjs

   src/index.html   the page: head, markup, and a marker where each part goes
   src/css/         the stylesheet, in pieces, joined in the order of build-order.txt
   src/js/<part>/   one file per function (and one per run of constants), joined
                    in the order of build-order.txt, into six <script> blocks

   grouptodo.html stays a single file with nothing to load, so it still opens
   from a folder, a share or a phone. Edit src/, then build; never edit the
   built file. */
import {readFileSync, writeFileSync, existsSync, readdirSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {stripJs, stripCss, stripHtml} from "./strip.mjs";

export const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const read = rel => readFileSync(join(SRC, rel), "utf-8");

/* src/assets/<name>.svg is the picture as a designer would open it. In the
   code, SVG("name") becomes that markup as a string, and SVG_URI("name") a
   data: address for it (an icon, a manifest); in index.html the same address
   stands where <!--@svg-uri:name--> is. */
const svgText = name => read("assets/" + name + ".svg").trim().replace(/>\s+</g, "><").replace(/\s*\n\s*/g, " ");
const svgUri = name => "data:image/svg+xml," + encodeURIComponent(svgText(name)).replace(/'/g, "%27");
const withAssets = code => code
  .replace(/SVG_URI\("([\w-]+)"\)/g, (_, n) => JSON.stringify(svgUri(n)))
  .replace(/SVG\("([\w-]+)"\)/g, (_, n) => JSON.stringify(svgText(n)));


/* src/Review.Starfield.html is the celebration for "Mark the review done" as it
   was designed: a page of its own. Only its sky is taken: the stylesheet from
   the "Space" section on, the black layer and the reduced-motion card, and the
   script. Its ids and the one class that the app also uses are given an sf-
   name, its sample projects and mock-up buttons are left out, and the script
   ends in window.starfieldPlay(projects, {title, sub, sound, onEnd}). */
function starfield() {
  const src = read("Review.Starfield.html");
  const cut = (text, from, to) => {
    const a = text.indexOf(from), b = text.indexOf(to, a);
    if (a < 0 || b < 0) throw new Error("Review.Starfield.html changed: " + from);
    return text.slice(a, b);
  };
  const once = (text, re, to) => {
    if (!re.test(text)) throw new Error("Review.Starfield.html changed: " + re);
    return text.replace(re, to);
  };
  const ids = ["space", "sky", "exit", "score", "level", "unlock", "sfinal", "crawlwrap", "crawltext", "crawl", "finale", "anyway", "close", "ftitle"];
  const rename = t => ids.reduce((x, id) => x.replace(new RegExp("#" + id + "\\b", "g"), "#sf-" + id)
    .replace(new RegExp('id="' + id + '"', "g"), 'id="sf-' + id + '"'), t)
    .replace(/\.space\b/g, ".sfspace").replace('class="space"', 'class="sfspace"');
  const vars = cut(src, "--space:", "}").replace(/\s*\n\s*/g, " ").trim();
  const css = rename(cut(src, "/* Space */", "@media (max-width:520px)")) +
    "#sf-space,#sf-finale{" + vars + ";--scrim:rgba(0,0,0,.6)}";
  let html = rename(cut(src, '<div class="space"', '<div class="toast"'));
  html = once(html, /<p>Your system is current[^<]*<\/p>/, '<p id="sf-fsub"></p>');
  html = once(html, /<div class="row">[\s\S]*?<\/div>/, '<div class="row"><button class="btn" id="sf-anyway" type="button">Play it anyway</button><button class="btn primary" id="sf-close" type="button">Back to the review</button></div>');
  let js = rename(cut(src, "(() => {", "</script>"));
  js = once(js, /const PROJECTS = \[[\s\S]*?\n  \];/, "let PROJECTS = [], onEnd = () => {};");
  js = once(js, /const cardsEl[\s\S]*?cardsEl\.append\(d\);\n  \}\n/, "");
  js = once(js, /function toast\(msgText\) \{[\s\S]*?\n  \}\n/, "");
  js = once(js, /\n\s*toast\("Weekly review logged[^\n]*/, "");
  js = once(js, /\n\s*try \{ soundOn = localStorage[^\n]*/, "");
  js = js.split('$("#replay").hidden = false;').join("").split('$("#done").focus();').join("onEnd();");
  js = once(js, /\n\s*\$\("#done"\)\.addEventListener[^\n]*\n\s*\$\("#replay"\)\.addEventListener[^\n]*/, "");
  js = once(js, /\n\s*const soundBtn[\s\S]*\n\}\)\(\);/, `
  window.starfieldPlay = (projects, o) => {
    if (phase !== "idle") return;
    PROJECTS = projects; IMGS = null; onEnd = o.onEnd || (() => {}); soundOn = o.sound !== false;
    $(".smsg h2").textContent = o.title; $(".smsg p").textContent = o.sub; $("#sf-fsub").textContent = o.sub;
    start(false);
  };
})();`);
  return {css, html, js};
}

/* strip: comments, indentation and blank lines are left out of the built file
   (strip.mjs). Tools that read the readable text, like the language catalog,
   ask for strip: false. */
export function buildApp({strip = true} = {}) {
  const parts = {css: [], js: {}};
  let into = null;
  for (const raw of read("build-order.txt").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") && !/^# (css|script \d+)$/.test(line)) continue;
    if (line === "# css") { into = parts.css; continue; }
    const m = /^# script (\d+)$/.exec(line);
    if (m) { into = parts.js[m[1]] = []; continue; }
    if (!existsSync(join(SRC, line))) throw new Error("build-order.txt names a file that is not there: " + line);
    into.push(line);
  }
  /* A file nobody lists would silently be left out of the app. */
  const listed = new Set([...parts.css, ...Object.values(parts.js).flat()]);
  const onDisk = dir => readdirSync(join(SRC, dir), {withFileTypes: true}).flatMap(d =>
    d.isDirectory() ? onDisk(dir + "/" + d.name) : /\.(js|css)$/.test(d.name) ? [dir + "/" + d.name] : []);
  const loose = ["css", "js"].flatMap(onDisk).filter(f => !listed.has(f));
  if (loose.length) throw new Error("not in build-order.txt, so not in the app: " + loose.join(", "));
  const css = parts.css.map(f => strip ? stripCss(read(f)) : read(f)).join("");
  const sky = starfield();
  let html = (strip ? stripHtml(read("index.html")) : read("index.html")).replace("<!--@css-->", () => "<style>" + css + sky.css + "</style>")
    .replace("<!--@starfield-->", () => sky.html);
  html = html.replace(/<!--@js:(\d+)-->/g, (_, n) => {
    if (!parts.js[n]) throw new Error("index.html wants script " + n + ", build-order.txt has none");
    return "<script>\n" + (n === "1" ? sky.js + "\n" : "") + parts.js[n].map(f => withAssets(strip ? stripJs(read(f)) : read(f)).replace(/\s+$/, "")).join(strip ? "\n" : "\n\n") + "\n</script>";
  });
  return html.replace(/<!--@svg-uri:([\w-]+)-->/g, (_, n) => svgUri(n));
}

/*  node build.mjs               grouptodo.html, without comments and indentation
    node build.mjs --readable    the same with them in, to read the built file
    node build.mjs --print       the readable text on stdout, nothing written */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const flag = process.argv[2];
  if (flag === "--print") {
    process.stdout.write(buildApp({strip: false}));    // no process.exit: a pipe still has to drain
  } else {
    const html = buildApp({strip: flag !== "--readable"});
    writeFileSync(join(ROOT, "grouptodo.html"), html);
    writeFileSync(join(ROOT, "icon.svg"), read("assets/app-icon.svg"));   // the served copy the manifest points at
    console.log("grouptodo.html built, " + html.length + " characters");
  }
}
