/* The days from today on, made before the schedule said so -- templates only
   pour into a page once, when it is made -- given the tracker; and with
   remove, the ones the schedule no longer includes relieved of it while
   nothing is written in it yet. */
function syncTrackerDays(name, key, names, {remove = false} = {}) {
  let added = 0, removed = 0;
  for (const p of allPages(isJournalPath)) {
    const d = dayOfPath(p);
    if (!d || d < todayISO()) continue;
    const page = getPage(p);
    const on = whenOnDay(names, d), has = pageHasTracker(page, name);
    if (on && !has) { page.props = page.props || {}; page.props[key] = ""; touch(p); added++; }
    else if (on && liftTrackerLine(page, name)) touch(p);
    else if (!on && has && remove) {
      const keys = Object.keys(page.props || {}).filter(k => parseTracker(k + "::")?.name === name && !trim(String(page.props[k] || "")));
      if (!keys.length) continue;
      for (const k of keys) delete page.props[k];
      touch(p); removed++;
    }
  }
  return {added, removed};
}
