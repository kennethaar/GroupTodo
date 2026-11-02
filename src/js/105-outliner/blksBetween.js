/* The lines the box touched, as the outermost ones only: a line inside another
   picked line is already coming along, and counting it twice would cut it out
   of a parent that is itself being cut. */
function blksBetween(outline, a, b) {
  const all = $$(".blk", outline);
  let i = all.indexOf(a), j = all.indexOf(b);
  if (i < 0 || j < 0) return [];
  if (i > j) { const t = i; i = j; j = t; }
  const span = all.slice(i, j + 1);
  return span.filter(n => !span.some(m => m !== n && m.contains(n)));
}
