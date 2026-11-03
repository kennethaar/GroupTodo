/* What build.mjs takes out of the source on its way to grouptodo.html:
   comments, the indentation at the start of a line, trailing spaces and blank
   lines. Nothing else is touched, and no line is joined to another, so a
   statement that relies on the line ending (no semicolon) keeps working.

   The scanner knows what a string, a template literal (and the code inside its
   ${ }), a regular expression and a comment are, so `"//"`, `/\/*\//` and a
   multi-line template come through as they were written.

   Pure Node, no dependencies, like the rest of the build. */

/* A word after which a / starts a regular expression, not a division. */
const REGEX_AFTER_WORD = new Set(["return", "typeof", "instanceof", "in", "of", "new", "delete", "void",
  "throw", "case", "do", "else", "yield", "await"]);
const isWordChar = c => c !== undefined && /[\w$\u0080-￿]/.test(c);

export function stripJs(src) {
  const out = [];          // finished lines
  let cur = "";            // the line being written
  let atStart = true;      // at the start of a line of code: leading blanks are dropped
  let last = "";           // the last significant character written
  let word = "";           // the word that ends there, if it ends in one
  const braces = [];       // "{" or "$" (the } of a ${ } goes back to the template)
  let i = 0;
  const n = src.length;

  const put = s => { cur += s; atStart = false; };
  const endLine = () => {
    const t = cur.replace(/[ \t]+$/, "");
    if (t) out.push(t);
    cur = ""; atStart = true;
  };
  const sig = (c, w) => { last = c; word = w === undefined ? "" : w; };

  /* The inside of a template literal, from just after the ` or the } that
     closes a ${ }, up to and including the closing ` or the next ${. */
  const template = () => {
    let j = i;
    while (j < n) {
      const c = src[j];
      if (c === "\\") { j += 2; continue; }
      if (c === "`") { put(src.slice(i, j + 1)); i = j + 1; sig("`"); return; }
      if (c === "$" && src[j + 1] === "{") { put(src.slice(i, j + 2)); i = j + 2; braces.push("$"); sig("{"); return; }
      j++;
    }
    put(src.slice(i)); i = n;
  };

  while (i < n) {
    const c = src[i];
    if (c === "\n") { endLine(); i++; continue; }
    if (c === " " || c === "\t" || c === "\r") {
      if (!atStart) put(c);
      i++; continue;
    }
    if (c === "/" && src[i + 1] === "/") {            // line comment: leave the newline
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {            // block comment
      const e = src.indexOf("*/", i + 2), end = e < 0 ? n : e + 2;
      const body = src.slice(i, end);
      if (body.includes("\n")) { endLine(); }
      else if (!atStart) put(" ");
      i = end; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      put(src.slice(i, j + 1)); i = j + 1; sig(c); continue;
    }
    if (c === "`") { put("`"); i++; template(); continue; }
    if (c === "/") {
      const regexOk = last === "" || (isWordChar(last) ? REGEX_AFTER_WORD.has(word) : !/[)\]}"'`]/.test(last));
      if (regexOk) {
        let j = i + 1, cls = false;
        while (j < n && src[j] !== "\n") {
          const d = src[j];
          if (d === "\\") { j += 2; continue; }
          if (d === "[") cls = true; else if (d === "]") cls = false;
          else if (d === "/" && !cls) break;
          j++;
        }
        j++;
        while (j < n && /[a-z]/i.test(src[j])) j++;   // flags
        put(src.slice(i, j)); i = j; sig(")"); continue;   // a regex ends a value, like )
      }
    }
    if (c === "{") braces.push("{");
    if (c === "}") {
      const top = braces.pop();
      if (top === "$") { put("}"); i++; template(); continue; }
    }
    if (isWordChar(c)) {
      let j = i + 1;
      while (j < n && isWordChar(src[j])) j++;
      const w = src.slice(i, j);
      put(w); i = j; sig(w[w.length - 1], w); continue;
    }
    put(c); i++; sig(c);
  }
  endLine();
  return out.join("\n") + "\n";
}

export function stripCss(src) {
  const out = [];
  let cur = "";
  let i = 0;
  const n = src.length;
  const endLine = () => { const t = cur.trim(); if (t) out.push(t); cur = ""; };
  while (i < n) {
    const c = src[i];
    if (c === "\n") { endLine(); i++; continue; }
    if (c === "/" && src[i + 1] === "*") {
      const e = src.indexOf("*/", i + 2), end = e < 0 ? n : e + 2;
      if (src.slice(i, end).includes("\n")) endLine(); else cur += " ";
      i = end; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      cur += src.slice(i, j + 1); i = j + 1; continue;
    }
    cur += c; i++;
  }
  endLine();
  return out.join("\n") + "\n";
}

/* index.html: HTML comments go, except the build's own markers, and so does
   the indentation. The page has no <pre> or <textarea> to protect. */
export function stripHtml(src) {
  return src.replace(/<!--(?!@)[\s\S]*?-->/g, "").split("\n")
    .map(l => l.replace(/^[ \t]+|[ \t]+$/g, "")).filter(Boolean).join("\n") + "\n";
}
