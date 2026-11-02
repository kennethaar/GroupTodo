/* ---------- what you wrote last time ----------
   A value on a day page -- a tracker, or any key:: of your own -- shows faintly
   what you wrote the last time you filled it in, so today's number has
   something to be compared with. Only your own earlier day pages count, and
   only values that say something: bookkeeping like created:: stays out. */
const DAY_VALUE_SKIP = /^(title|type|alias|aliases|tags|archived|collapsed|icon|msg|at|cal_feed|cal_uid|time|date|attendees|from|member|kind|deleted|in|out)$/i;
const isDayValueKey = k => !!k && !BOOKKEEPING.test(k) && !DAY_VALUE_SKIP.test(k) && !/^tracker-/i.test(k) && !/^template_|^feature_/i.test(k);
const prevKeyOf = (k, v) => { const t = parseTracker(k + ":: " + (v ?? "")); return t ? "tracker:" + t.name : String(k).toLowerCase(); };
