function lineSelClear(paint = true) {
  const had = LINE_SEL.ids.length;
  LINE_SEL.path = null;
  LINE_SEL.ids = [];
  LINE_SEL.anchor = LINE_SEL.head = null;
  // The bar goes whatever happens: the lines it was about are no longer picked,
  // and a bar offering to cut nothing is worse than no bar.
  lineSelHud();
  if (paint && had) for (const n of $$(".blk.lsel")) n.classList.remove("lsel");
  return !!had;
}
