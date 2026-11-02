/* ---------- the weekly review: the weeks ----------
   Looking back is one list -- what is still open on a past week page, and
   what is late -- oldest first, each with the way to where it was written.
   Looking ahead is this week and the two after, one at a time. */
function unfinishedPast() {
  const today = todayISO(), now = weekOf(today), out = [];
  for (const a of myOpen()) {
    const wk = isWeekPath(a.path) ? baseName(a.path) : null;
    if (wk && wk < now) {
      out.push({a, key: weekMonday(wk), where: wk,
        go: () => go("today", {sub: "week", todayDay: null, todayWeek: wk})});
      continue;
    }
    const end = taskEnd(a.block);
    if (!end || end >= today) continue;
    const dt = parseISO(end);
    out.push({a, key: end, late: dateDiffDays(end, today), kind: a.state === "WAIT" ? "wait" : "late",
      where: capitalise(dt.toLocaleDateString(undefined, {weekday: "short", day: "numeric", month: "short"})),
      go: () => go("today", {sub: null, todayWeek: null, todayDay: end})});
  }
  return out.sort((x, y) => x.key.localeCompare(y.key));
}
