function weekLabel(monday) {
  const [w] = isoWeek(monday) || [""];
  const fmt = iso => parseISO(iso).toLocaleDateString(undefined, {day: "numeric", month: "short"});
  return "Week " + w + " · " + fmt(monday) + " – " + fmt(shiftISO(monday, 6));
}
