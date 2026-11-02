function qbRowText(r) {
  let s = "";
  switch (r.kind) {
    case "task": s = r.states.length ? "(task " + r.states.join(" ") + ")" : ""; break;
    case "link": s = trim(r.a) ? "[[" + trim(r.a) + "]]" : ""; break;
    case "tag": { const t = trim(r.a).replace(/^#/, ""); s = !t ? "" : /\s/.test(t) ? "[[" + t + "]]" : "#" + t; break; }
    case "text": s = trim(r.a) ? '"' + trim(r.a).replace(/"/g, "") + '"' : ""; break;
    case "page": s = trim(r.a) ? '(page "' + trim(r.a).replace(/"/g, "") + '")' : ""; break;
    case "prop": s = trim(r.a) ? "(property " + trim(r.a) + (trim(r.b) ? " " + qbQuote(trim(r.b)) : "") + ")" : ""; break;
    case "pageprop": s = trim(r.a) ? "(page-property " + trim(r.a) + (trim(r.b) ? " " + qbQuote(trim(r.b)) : "") + ")" : ""; break;
    case "between": s = trim(r.a) ? "(between " + trim(r.a) + " " + (trim(r.b) || "today") + ")" : ""; break;
  }
  return s && r.not ? "(not " + s + ")" : s;
}
