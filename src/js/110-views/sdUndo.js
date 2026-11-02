function sdUndo() {
  if (!SD.last) return;
  const {space, x} = SD.last;
  sdSave(space, sdResults(space).filter(y => !(y.w === x.w && y.l === x.l && y.at === x.at)));
  SD.last = null;
  SD.n = Math.max(0, SD.n - 1);
  render();
}
