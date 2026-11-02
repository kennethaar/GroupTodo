/* ---------- calendars into the day ----------
   The app may only talk to itself and to a server on this machine (the CSP
   at the top says so), so a calendar link is fetched by serve.py on its
   behalf, at /api/calendar. The links are kept on this device only: a
   secret calendar link written into a shared folder is the whole calendar
   shared. Meetings land as #meeting lines on the day pages of the area
   chosen for the link, for the next two weeks. */
const CAL_FEEDS_KEY = "calendar.feeds";
const CAL_DAYS_AHEAD = 14;
const CAL_EVERY_MIN = 15;     // while the app is open
const CAL_RETURN_MIN = 5;     // coming back to the app after this long fetches again
/* Outlook and Google publish a calendar's link on their own schedule, so a
   meeting made a minute ago is often not in it yet. Said wherever a fetch is. */
const CAL_LAG_NOTE = "Outlook and Google update these links on their own schedule, often 30 minutes to a few hours " +
  "behind, so a meeting you just made may not be in them yet.";
const calFeeds = () => { try { return JSON.parse(PREF.get(CAL_FEEDS_KEY, "[]")) || []; } catch (_) { return []; } };
const setCalFeeds = list => PREF.set(CAL_FEEDS_KEY, JSON.stringify(list));
const calHash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
const calFeedId = url => calHash(trim(url).replace(/^webcal:/i, "https:"));
const calHost = url => { try { return new URL(trim(url).replace(/^webcal:/i, "https:")).host; } catch (_) { return "calendar"; } };
