/* Where in the raw text a point on the drawn line falls. Words drawn as they
   are written are found again in the raw text, in order; a link drawn as
   something else (@office for [[c/office]]) puts the caret before it or after
   it, by which half was clicked. Nothing drawn after the point is the end. */
function rawOffsetAt(host, x, y, raw) {
  let node = null, off = 0;
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p) { node = p.offsetNode; off = p.offset; }
  } else if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r) { node = r.startContainer; off = r.startOffset; }
  }
  if (!node || !host.contains(node)) return null;
  const part = document.createRange();
  part.selectNodeContents(host);
  part.setStart(node, off);
  if (!trim(part.toString())) return raw.length;
  part.selectNodeContents(host);
  part.setEnd(node, off);
  const want = part.toString().length;
  const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  let seen = 0, from = 0;
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const len = t.data.length, at = raw.indexOf(t.data, from);
    if (want <= seen + len) {
      const into = want - seen;
      if (at >= 0) return at + into;
      if (into * 2 < len) return from;
      const close = raw.indexOf("]]", from);
      return close >= 0 ? close + 2 : raw.length;
    }
    if (at >= 0) from = at + len;
    seen += len;
  }
  return null;
}
