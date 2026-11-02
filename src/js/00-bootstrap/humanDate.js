function humanDate(iso) {
  const d = parseISO(iso); if (!d) return iso || "";
  const t = todayISO();
  if (iso === t) return "Today";
  if (iso === shiftISO(t, 1)) return "Tomorrow";
  if (iso === shiftISO(t, -1)) return "Yesterday";
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return dateFormat(sameYear).format(d);
}
