function moveTracker(name, to, day = todayISO()) {
  const today = todayISO();
  let tpls = 0, days = 0;
  for (const {sp, p} of trackerTemplatesWith(name)) {
    const n = baseName(p);
    if (sp === to || !isWhenName(n) || isPastWhenName(n, today)) continue;
    const key = inSpace(sp, () => trackerKeyIn(getPage(p), name));
    inSpace(sp, () => dropTrackerLine(p, name));
    // The plain journals template is all of an area's days; one it has not got is this year's.
    inSpace(to, () => addTrackerLine(n === "journals" && !V.pages.has(join(DIRS.lists, "journals.md")) ? today.slice(0, 4) : n, key));
    tpls++;
  }
  for (const sp of LOADED.keys()) {
    if (sp === to) continue;
    const moves = inSpace(sp, () => {
      const out = [];
      for (const p of allPages(isJournalPath)) {
        const d = dayOfPath(p), page = getPage(p);
        if (!d || (d !== day && d < today) || p !== journalPath(d)) continue;
        liftTrackerLine(page, name);
        const keys = Object.keys(page.props || {}).filter(k => parseTracker(k + "::")?.name === name);
        if (!keys.length) continue;
        out.push({d, vals: keys.map(k => [k, page.props[k]])});
        for (const k of keys) delete page.props[k];
        touch(p);
      }
      return out;
    });
    for (const {d, vals} of moves) inSpace(to, () => {
      const filled = vals.some(([, v]) => trim(String(v || "")));
      // A day not made there yet gets the tracker from the templates when it is.
      if (!V.pages.has(journalPath(d)) && !filled && d !== day) return;
      const path = ensureJournal(d), page = getPage(path);
      page.props = page.props || {};
      liftTrackerLine(page, name);
      for (const [k, v] of vals) {
        const cur = Object.keys(page.props).find(x => parseTracker(x + "::")?.name === name);
        if (cur && trim(String(page.props[cur] || ""))) continue;
        if (cur) delete page.props[cur];
        page.props[k] = v;
      }
      touch(path);
      days++;
    });
  }
  notify(trackerTitle(name) + " now belongs to " + to + "." +
    (tpls ? " Moved in " + tpls + " template" + (tpls === 1 ? "" : "s") + "." : "") +
    (days ? " Moved on " + days + " day" + (days === 1 ? "" : "s") + "." : ""));
}
