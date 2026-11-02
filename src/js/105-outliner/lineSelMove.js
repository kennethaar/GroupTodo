function lineSelMove(dir, extend) {
  const head = blkEl(LINE_SEL.head), outline = head && head.closest(".outline");
  if (!outline) return;
  const all = $$(".blk", outline);
  const next = all[all.indexOf(head) + dir];
  if (!next || !next.dataset.id) return;
  LINE_SEL.head = next.dataset.id;
  if (!extend) LINE_SEL.anchor = LINE_SEL.head;
  const anchor = blkEl(LINE_SEL.anchor) || next;
  LINE_SEL.ids = blksBetween(outline, anchor, next).map(n => n.dataset.id).filter(Boolean);
  paintLineSel();
  next.scrollIntoView({block: "nearest"});
}
