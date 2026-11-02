function stopTracker(name) {
  const mine = t => !!t && t.name === name;
  const drop = list => list.filter(b => !mine(parseTracker(b.title)))
    .map(b => { if (b.children) b.children = drop(b.children); return b; });
  let tpls = 0, days = 0;
  for (const {sp, p} of trackerTemplatesWith(name)) inSpace(sp, () => {
    const page = getPage(p);
    for (const k of Object.keys(page.props || {})) if (mine(parseTracker(k + "::"))) delete page.props[k];
    page.blocks = drop(page.blocks || []);
    touch(p); tpls++;
  });
  for (const sp of LOADED.keys()) inSpace(sp, () => {
    for (const p of allPages(isJournalPath)) {
      const d = dayOfPath(p), page = getPage(p);
      if (!d || d < todayISO() || !page?.props) continue;
      const keys = Object.keys(page.props).filter(k => mine(parseTracker(k + "::")) && !trim(String(page.props[k] || "")));
      if (!keys.length) continue;
      for (const k of keys) delete page.props[k];
      touch(p); days++;
    }
  });
  render();
  notify("Stopped tracking " + trackerTitle(name) + (tpls ? ": out of " + tpls + " template" + (tpls === 1 ? "" : "s") : "") +
    (days ? (tpls ? ", " : ": ") + "off " + days + " day" + (days === 1 ? "" : "s") : "") + ". The history is kept.");
}
