/* ---------- meetings: a word before, and the next one at the top ----------
   A meeting is a #meeting line with a time:: on its day page, or with date::
   that day anywhere else -- the same lines Calendars writes and Alt+M makes.
   The next one is shown at the top of the screen, counting down. When the
   reminders come is kept on this device: one list for all meetings, and a
   calendar may keep its own. A reminder is a note in the corner and, when the
   browser allows it, a system notification. Each comes once. */
const MEET_REMIND_KEY = "meeting.remindMin";
/* Kept as "off", "start" or minutes before, several joined by commas
   ("10,45,1440"); a "0" from before At start existed means off. */
const MEET_REMIND_CHOICES = [["off", "Off"], ["start", "At start"], ["5", "5 min before"], ["10", "10 min before"],
  ["15", "15 min before"], ["30", "30 min before"], ["60", "1 hour before"]];
const MEET_REMIND_UNITS = [["minutes", 1], ["hours", 60], ["days", 1440], ["weeks", 10080]];
// The calendar a meeting came from, by its cal_feed:: hash.
const meetRemindFeed = feed => feed ? calFeeds().find(f => calFeedId(f.url) === feed) : null;
const meetRemindRaw = feed => meetRemindFeed(feed)?.remind ?? PREF.get(MEET_REMIND_KEY, "10");
// Minutes before the start, shortest first; 0 is at the start, none is off.
const meetRemindLeads = (feed = null, raw = meetRemindRaw(feed)) => {
  if (raw === "off" || raw === "0") return [];
  const out = new Set();
  for (const p of String(raw).split(",")) {
    const n = p.trim() === "start" ? 0 : parseInt(p, 10);
    if (isFinite(n) && n >= 0) out.add(n);
  }
  return out.size ? [...out].sort((a, b) => a - b) : [10];
};
const meetRemindValue = leads => !leads.length ? "off" : leads.length === 1 && leads[0] === 0 ? "start" : leads.join(",");
// Saved for one calendar, or for all meetings without feed.
const setMeetRemind = (url, leads) => {
  const v = meetRemindValue([...new Set(leads)].sort((a, b) => a - b));
  if (!url) return PREF.set(MEET_REMIND_KEY, v);
  setCalFeeds(calFeeds().map(f => f.url === url ? {...f, remind: v} : f));
};
// The earliest reminder, or null for none.
const meetRemindLead = (feed = null) => { const l = meetRemindLeads(feed); return l.length ? l[l.length - 1] : null; };
// "45 minutes before", or "45 min before" short; in the largest whole unit.
const meetLeadWords = (n, short = false) => {
  if (!n) return "At start";
  const [unit, size] = [...MEET_REMIND_UNITS].reverse().find(([, s]) => n % s === 0);
  const k = n / size, word = short && unit === "minutes" ? "min" : k === 1 ? unit.slice(0, -1) : unit;
  return k + " " + word + " before";
};
