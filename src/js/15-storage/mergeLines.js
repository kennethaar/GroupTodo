/* Three-way merge of lines. Between the lines all three still share, a side
   that left the base as it was takes the other side's version; when both
   changed it, mergeHunk sorts it out line by line. */
function mergeLines(base, ours, theirs) {
  const mo = lineMatches(base, ours), mt = lineMatches(base, theirs);
  const same = (x, y) => x.length === y.length && x.every((v, k) => v === y[k]);
  const out = [];
  let clashes = 0, i = 0, o = 0, t = 0;
  for (;;) {
    let k = i;
    while (k < base.length && (mo[k] < 0 || mt[k] < 0)) k++;
    const oe = k < base.length ? mo[k] : ours.length;
    const te = k < base.length ? mt[k] : theirs.length;
    const B = base.slice(i, k), O = ours.slice(o, oe), T = theirs.slice(t, te);
    if (same(O, B)) out.push(...T);
    else if (same(T, B) || same(O, T)) out.push(...O);
    else { const h = mergeHunk(B, O, T); out.push(...h.lines); if (h.clash) clashes++; }
    if (k >= base.length) break;
    out.push(base[k]);
    i = k + 1; o = oe + 1; t = te + 1;
  }
  return {lines: out, clashes};
}
