/* ---------- the query language ----------
   Logseq's simple queries, the parts that mean something here:
     [[page]]  #tag             lines that link to it, sit under a line that
                                does, or are written on that page
     "words"   bare words       lines with those words in them
     (task TODO DOING)          tasks in those states (todo works too)
     (page "name")              lines on that page
     (property key value)       lines with that value; without a value, any
     (page-property key value)  pages with that value (alone: the pages)
     (between -7d today)        lines from those days: the day page they are
                                on, or the day they were added
     (and ...) (or ...) (not ...)
   Several at the top are all required. Anything else -- sort-by, priority --
   is read and ignored, so a query brought over from Logseq still runs. */
function queryTokens(src) {
  const out = [], s = String(src || "");
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "(" && s[i + 1] === "(") {
      const j = s.indexOf("))", i + 2);
      if (j > 0) { out.push({t: "bref", v: s.slice(i + 2, j)}); i = j + 2; continue; }
    }
    if (c === "(" || c === ")") { out.push({t: c}); i++; continue; }
    if (c === "[" && s[i + 1] === "[") {
      const j = s.indexOf("]]", i + 2);
      const v = j > 0 ? s.slice(i + 2, j) : s.slice(i + 2);
      out.push({t: "link", v: trim(v.split("][")[0].split("|")[0])}); i = j > 0 ? j + 2 : s.length; continue;
    }
    if (c === '"' || c === "“") {
      const close = c === '"' ? '"' : "”";
      const j = s.indexOf(close, i + 1);
      out.push({t: "str", v: j > 0 ? s.slice(i + 1, j) : s.slice(i + 1)}); i = j > 0 ? j + 1 : s.length; continue;
    }
    let j = i;
    while (j < s.length && !/[\s()"]/.test(s[j])) j++;
    const w = s.slice(i, j);
    out.push(w[0] === "#" && w.length > 1 ? {t: "link", v: w.slice(1), tag: true} : {t: "word", v: w});
    i = j;
  }
  return out;
}
