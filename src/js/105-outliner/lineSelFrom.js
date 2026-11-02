function lineSelFrom(path, id) {
  LINE_SEL.path = path;
  LINE_SEL.ids = [id];
  LINE_SEL.anchor = LINE_SEL.head = id;
  paintLineSel();
  if (lineSelBlocks()?.blocks.some(b => b.state && !estTier(b.title))) estHint();
}
