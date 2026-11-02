// The stretch of time a pick holds for: today, and before, in or after work.
function choreSlot(now = new Date()) {
  const wh = workHours() || {start: "08:00"};
  const at = now.getHours() * 60 + now.getMinutes();
  return isoOf(now) + (choreTime(now) ? (at < senseMinutes(wh.start) ? ":before" : ":after") : ":work");
}
