function parseQuery(src) {
  const toks = queryTokens(src);
  let i = 0;
  const atom = t => t.t === "link" ? {op: "link", ref: t.v, tag: !!t.tag}
    : t.t === "str" ? {op: "text", s: t.v}
    : t.t === "bref" ? {op: "text", s: "((" + t.v + "))"}
    : {op: "text", s: t.v};
  const val = t => !t ? "" : t.t === "link" ? (t.tag ? "#" : "") + "[[" + t.v + "]]" : t.v;
  function expr() {
    const t = toks[i++];
    if (!t) return null;
    if (t.t === ")") return null;
    if (t.t !== "(") return atom(t);
    const head = toks[i] && toks[i].t === "word" ? toks[i++].v.toLowerCase() : "and";
    const args = [];
    while (i < toks.length && toks[i].t !== ")") args.push(toks[i].t === "(" ? expr() : toks[i++]);
    i++;                                               // the ")"
    const words = args.filter(a => a && a.t).map(val);
    // In the order written, so the builder hands a query back the way it came.
    const parts = args.filter(Boolean).map(a => a.t ? atom(a) : a);
    switch (head) {
      case "and": case "or": return {op: head, args: parts};
      case "not": return {op: "not", args: parts};
      case "task": case "todo":
        return {op: "task", states: words.map(w => w.toUpperCase()).map(w => STATE_ALIAS[w] || w).filter(w => TODO_STATES.includes(w))};
      case "page": return {op: "page", ref: words.map(w => w.replace(/^\[\[|\]\]$/g, "")).join(" ")};
      case "property": return {op: "prop", key: words[0] || "", value: words.slice(1).join(" ")};
      case "page-property": return {op: "pageprop", key: words[0] || "", value: words.slice(1).join(" ")};
      case "between": return {op: "between", from: words[0] || "", to: words[1] || words[0] || ""};
      default: return {op: "true"};                     // sort-by, priority, sample ...
    }
  }
  const top = [];
  while (i < toks.length) { const e = expr(); if (e) top.push(e); }
  return top.length === 1 ? top[0] : {op: "and", args: top};
}
