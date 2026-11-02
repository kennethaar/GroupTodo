function viewTrackers() {
  const c = el("div", {class: "wrap"});
  /* The charts, or one of the sheets: those with a tracker of their letter. */
  const sheets = SHEETS.filter(S => S.letter && trackerList().some(g => g.code === S.letter));
  const cur = sheets.find(S => S.id === state.trkSheet);
  if (sheets.length) {
    c.append(vhead("Trackers", cur ? cur.title + ", added up" : "What you write down on your days, over time"));
    c.append(fbar(fchip("Charts", !cur, () => go("trackers", {trkSheet: null})),
      ...sheets.map(S => fchip(S.title, S === cur, () => go("trackers", {trkSheet: S.id})))));
    if (cur) { c.append(viewSheet(cur)); return c; }
    topUpTrackerSeries();
    return viewTrackerCharts(c, true);
  }
  return viewTrackerCharts(c, false);
}
