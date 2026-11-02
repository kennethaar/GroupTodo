/* Reminded once each, also across a reload: the keys are kept for today. */
function meetReminded() {
  try {
    const o = JSON.parse(safeLS.get("gtd.meetReminded", "null"));
    return o && o.day === todayISO() ? new Set(o.keys) : new Set();
  } catch (_) { return new Set(); }
}
