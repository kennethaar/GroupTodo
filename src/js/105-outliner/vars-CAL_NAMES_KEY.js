/* A meeting only says which calendar it came from as a hash (cal_feed::), so
   each import remembers the name it went in under, on this device. That is
   how a calendar whose link is gone, or a .ics file, is still named when its
   meetings are cleared. */
const CAL_NAMES_KEY = "calendar.names";
const calNames = () => { try { return JSON.parse(PREF.get(CAL_NAMES_KEY, "{}")) || {}; } catch (_) { return {}; } };
const calNameFeed = (feed, name) => { const m = calNames(); if (m[feed] !== name) { m[feed] = name; PREF.set(CAL_NAMES_KEY, JSON.stringify(m)); } };
