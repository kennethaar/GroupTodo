/* Ctrl-click adds a line to the pick, or takes it off again, so lines that are
   not next to each other can go together. A line inside a picked line is
   already coming along; picking its parent takes over from it. */
function lineSelToggle(outline, path, blk) {
  if (LINE_SEL.path !== path) LINE_SEL.ids = [];
  LINE_SEL.path = path;
  const id = blk.dataset.id;
  let ids = LINE_SEL.ids.slice();
  if (ids.includes(id)) ids = ids.filter(x => x !== id);
  else {
    if (ids.some(x => blkEl(x)?.contains(blk))) return;
    ids = ids.filter(x => !blk.contains(blkEl(x)));
    ids.push(id);
  }
  if (!ids.length) { lineSelClear(); return; }
  const all = $$(".blk", outline);
  ids.sort((a, b) => all.indexOf(blkEl(a)) - all.indexOf(blkEl(b)));
  LINE_SEL.ids = ids;
  LINE_SEL.anchor = LINE_SEL.head = id;
  paintLineSel();
}
