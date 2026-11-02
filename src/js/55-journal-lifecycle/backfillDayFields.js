/* A day page's missing fields, from every template the day has, poured the
   way ensureJournal pours them -- so a page made before its templates were
   there still gets its trackers. Only today and the days ahead get a
   tracker: one turning up on a day gone by would read as a day you skipped. */
function backfillDayFields(page, day, tpls) {
  const props = page.props || (page.props = {});
  const present = new Set(Object.keys(props).map(k => k.toLowerCase()));
  let changed = false;
  for (const [k, v] of Object.entries(pourDayTemplates(day, tpls).props)) {
    if (present.has(k.toLowerCase()) || /^(template_rules|feature_)/i.test(k)) continue;
    const t = parseTracker(k + "::");
    if (t && (day < todayISO() || pageHasTracker(page, t.name))) continue;
    props[k] = v; changed = true;
  }
  return changed;
}
