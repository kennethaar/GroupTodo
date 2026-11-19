/* #428 Ranges over a line's words for the known names it does not link
   yet. Works on the raw line being edited and on a drawn one alike: text
   inside a link, code or a chip counts as blanks, and a drawn link says
   what it links through data-link. */
function squiggleRanges(host) {
  const nodes = [], walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  let s = "";
  for (let n; (n = walk.nextNode());) {
    const shut = n.parentElement.closest("[data-link], [data-bref], a, code, kbd, .chip, .props, button");
    const skip = !!shut && host.contains(shut);
    nodes.push({n, from: s.length, skip});
    s += skip ? " ".repeat(n.length) : n.data;
  }
  const linked = [...host.querySelectorAll("[data-link]")].map(a => a.dataset.link).concat(linksIn(s));
  const at = (i, last) => nodes.find(x => !x.skip && (last ? i > x.from && i <= x.from + x.n.length : i >= x.from && i < x.from + x.n.length));
  const out = [];
  for (const sp of unlinkedNames(s, linked)) {
    const a = at(sp.at, false), b = at(sp.end, true);
    if (!a || !b) continue;
    const r = new Range();
    r.setStart(a.n, sp.at - a.from);
    r.setEnd(b.n, sp.end - b.from);
    out.push(r);
  }
  return out;
}
