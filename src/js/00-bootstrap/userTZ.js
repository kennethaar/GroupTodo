/* Timestamps are written to the files in UTC so two people in different
   offices compare cleanly. Everything shown on screen is converted to the
   timezone set on this device -- including which day "today" is, so a journal
   written while travelling still lands on the day you think you are in. */
function userTZ() {
  const set = (typeof PREF !== "undefined") ? PREF.get("timezone", "") : "";
  if (set) return set;
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
  catch (_) { return "UTC"; }
}
