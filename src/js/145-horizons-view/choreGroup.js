/* Due now is its day come round; coming up is within the week. */
function choreGroup(a) {
  const f = freshnessOf(a);
  if (f ? f.rounds >= 1 : a.due && a.due <= todayISO()) return "due";
  return a.due && a.due <= shiftISO(todayISO(), 7) ? "soon" : "fresh";
}
