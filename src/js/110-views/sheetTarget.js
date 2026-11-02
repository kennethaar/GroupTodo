/* Per weekday, Sunday first, or null when nothing says. */
function sheetTarget(S) {
  if (!S.diff) return null;
  const raw = sheetSetting(S, "target");
  if (raw) {
    const per = Array(7).fill(0);
    let any = false;
    const re = /(sun|mon|tue|wed|thu|fri|sat)[a-z]*(?:\s*-\s*(sun|mon|tue|wed|thu|fri|sat)[a-z]*)?\s*:?\s*(\d+(?:[.,]\d+|:\d{2})?)/gi;
    for (const m of raw.matchAll(re)) { for (const d of dayRun(m[1], m[2] || m[1])) per[d] = sheetNum(S, m[3]); any = true; }
    if (any) return per;
  }
  const wh = S.id === "hours" && workHours();
  if (!wh) return null;
  const len = (hmMinutes(wh.end) - hmMinutes(wh.start) + 1440) % 1440;
  return WEEKDAY_KEYS.map((_, d) => wh.days.includes(d) ? len : 0);
}
