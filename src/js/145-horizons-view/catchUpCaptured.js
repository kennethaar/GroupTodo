/* The clKeys of the lines Catch up put on today's page (#516), so Clarify
   takes them today. Yesterday's list is gone: from tomorrow the day is asked
   about whole, as every past day is. */
function catchUpCaptured() {
  try {
    const o = JSON.parse(PREF.get(CATCHUP_CAPTURED, "") || "null");
    return new Set(o && o.day === todayISO() && Array.isArray(o.keys) ? o.keys : []);
  } catch (_) { return new Set(); }
}
