function areaFilter(rows, key) {
  const names = [...new Set(rows.map(areaOfRow).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const cur = PREF.get(key, "");
  const keep = r => !cur || (cur === "-" ? !areaOfRow(r) : areaOfRow(r) === cur);
  const opts = names.length ? [["", "All areas"], ["-", "No area"], ...names.map(a => [a, a])] : [];
  const set = v => { PREF.set(key, v); render(); };
  const sel = opts.length ? fselect("Area", cur, opts, set) : null;
  return {cur, keep, sel, opts, set};
}
