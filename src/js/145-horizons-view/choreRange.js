/* ---------- the days a chores sheet covers (#325) ----------
   "week" is today to Sunday; "next" the coming Monday to Sunday, for the
   sheet printed on a Sunday evening for the fridge. */
function choreRange(kind, today) {
  const t = today || todayISO();
  const toSunday = (7 - new Date(t + "T00:00:00Z").getUTCDay()) % 7;
  const sunday = shiftISO(t, toSunday);
  return kind === "next" ? {from: shiftISO(sunday, 1), to: shiftISO(sunday, 7)} : {from: t, to: sunday};
}
