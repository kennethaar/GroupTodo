/* Every line of its trackers, oldest first, with what it comes to. */
function sheetEntries(S) {
  return memo("sheet:" + S.id, () => {
    if (S.source) return S.source();
    const names = new Set(sheetTrackers(S));
    return trackerEntries().filter(e => e.code === S.letter && names.has(e.name) &&
      (!S.mine || inSpace(e.space || V.space, () => myJournal(e.path))))
      .map(e => Object.assign({date: e.date, name: e.name, e}, lineValue(S.letter, e.raw, e.date)));
  });
}
