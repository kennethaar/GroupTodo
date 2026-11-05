/* When each calendar was last fetched without a failure, and when a calendar
   was taken off the list, both by feed id and kept on this device. Calendars
   shows them per calendar and in the removed-calendar entry. */
const CAL_SYNCED_KEY = "calendar.synced";
const CAL_REMOVED_KEY = "calendar.removed";
const calStamps = key => { try { return JSON.parse(PREF.get(key, "{}")) || {}; } catch (_) { return {}; } };
const calStamp = (key, feed) => {
  const m = calStamps(key);
  m[feed] = Date.now();
  PREF.set(key, JSON.stringify(m));
};
