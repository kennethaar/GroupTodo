function estFilter(rows, key, plan) {
  const choices = plan ? EST_FILTERS.concat(EST_PLANS) : EST_FILTERS;
  let cur = PREF.get(key, "");
  if (!choices.some(([v]) => v === cur)) cur = "";
  const keep = r => estFits(cur, estOfRow(r));
  const count = v => estPlan(v) ? planFill(rows, estPlan(v)).length : rows.filter(r => estFits(v, estOfRow(r))).length;
  const sel = cur || rows.some(estOfRow)
    ? fselect("Time", cur, choices.map(([v, l]) => [v, v ? l + " (" + count(v) + ")" : l]),
      v => { PREF.set(key, v); render(); })
    : null;
  return {cur, keep, sel, plan: estPlan(cur)};
}
