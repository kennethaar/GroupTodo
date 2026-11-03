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
  let html = (strip ? stripHtml(read("index.html")) : read("index.html")).replace("<!--@css-->", () => "<style>" + css + "</style>");
  html = html.replace(/<!--@js:(\d+)-->/g, (_, n) => {
    if (!parts.js[n]) throw new Error("index.html wants script " + n + ", build-order.txt has none");
    return "<script>\n" + parts.js[n].map(f => withAssets(strip ? stripJs(read(f)) : read(f)).replace(/\s+$/, "")).join(strip ? "\n" : "\n\n") + "\n</script>";
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
