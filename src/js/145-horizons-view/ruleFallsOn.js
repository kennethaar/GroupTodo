/* Does the rule, started on `anchor`, fall on `day`? */
function ruleFallsOn(r, day, anchor) {
  anchor = anchor || day;
  if (!r || day < anchor) return false;
  const d = parseISO(day), a = parseISO(anchor);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const dayFits = () => r.nth
    ? d.getDay() === r.wd && (r.nth > 0 ? Math.ceil(d.getDate() / 7) === r.nth : d.getDate() + 7 > last)
    : d.getDate() === Math.min(r.mday || a.getDate(), last);
  if (r.freq === "day") return dateDiffDays(anchor, day) % r.n === 0;
  if (r.freq === "week") {
    if (!(r.days && r.days.length ? r.days : [a.getDay()]).includes(d.getDay())) return false;
    const monday = iso => shiftISO(iso, -((parseISO(iso).getDay() + 6) % 7));
    return (dateDiffDays(monday(anchor), monday(day)) / 7) % r.n === 0;
  }
  if (r.freq === "month") {
    const months = (d.getFullYear() - a.getFullYear()) * 12 + d.getMonth() - a.getMonth();
    return months % r.n === 0 && dayFits();
  }
  if ((d.getFullYear() - a.getFullYear()) % r.n) return false;
  return d.getMonth() === (r.month != null ? r.month : a.getMonth()) && dayFits();
}
