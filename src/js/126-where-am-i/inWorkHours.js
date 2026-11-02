// Whether now is inside work hours; to before from runs past midnight.
function inWorkHours(work, now) {
  if (!work || !work.ctx) return false;
  const from = senseMinutes(work.from), to = senseMinutes(work.to);
  if (from == null || to == null || from === to) return false;
  const at = now.getHours() * 60 + now.getMinutes();
  const day = (now.getDay() + (to < from && at < to ? 6 : 0)) % 7;   // after midnight it is still last night's shift
  if (!(work.days || []).includes(day)) return false;
  return from < to ? at >= from && at < to : at >= from || at < to;
}
