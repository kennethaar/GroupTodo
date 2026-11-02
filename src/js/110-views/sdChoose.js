function sdChoose(space, w, l) {
  const x = {w: sdSlug(w), l: sdSlug(l), at: todayISO()};
  sdSave(space, [...sdResults(space), x]);
  SD.last = {space, x};
  SD.n++;
  render();
}
