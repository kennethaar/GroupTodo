/* Reminded once each, also across a reload: the keys start with the meeting's
   day and are kept until it has passed. */
function meetReminded() {
  try {
    const o = JSON.parse(safeLS.get("gtd.meetReminded", "null")), today = todayISO();
    return new Set((o?.keys || []).filter(k => k.slice(0, 10) >= today));
  } catch (_) { return new Set(); }
}
