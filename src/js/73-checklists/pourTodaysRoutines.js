/* Today's page in this area gets what falls today; called as Today is drawn. */
function pourTodaysRoutines(target) {
  const got = pourDueRoutines(target, todayISO());
  if (got.length) notify((got.length === 1 ? got[0] : got.length + " routines") + " put on today, as it comes round today.");
  return got.length;
}
