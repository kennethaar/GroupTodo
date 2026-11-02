/* ---------- when a tracker comes round ----------
   The schedule is the journal templates the tracker's line is written into,
   and nothing else. Settings is where it lives: editing those pages by
   hand changes it as surely as the When button on the Trackers page does,
   which only reads the templates and writes them back. What the names mean:

     2026                     every day of the year
     2026-Monday              every Monday, one template per weekday picked
     01-15 … 12-15            the 15th of every month, and every year after
     2026-06                  every day in June
     2026-10-22, 2026-10-24   one day each: every N days, or every N weeks

   A run of single days -- every 2 days, every other Monday -- is read back
   from the dates themselves. It is kept written about four months ahead and
   the days gone by are tidied away, so it neither runs out at New Year nor
   fills the folder with a year of files.

   when: {mode: "daily"} | {mode: "weekly", days: [0-6]} (0 is Sunday)
         | {mode: "ndays", n, start} | {mode: "nweeks", n, days, start}
         | {mode: "monthdays", mdays: [1-31]} | {mode: "months", months: [1-12]}
   Older callers pass only {days}: all seven is every day, fewer are weekdays. */
const SERIES_AHEAD = 120, SERIES_TOPUP = 60, SERIES_KEEP = 7;
const isDateName = n => /^\d{4}-\d{2}-\d{2}$/.test(n);
const monFirst = (a, b) => ((a + 6) % 7) - ((b + 6) % 7);
const MONTH_LEN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const whenMode = w => w.mode || (w.days && w.days.length === 7 ? "daily" : "weekly");
const weekdayOfName = n => {
  const m = /^(\d{4})-(\p{L}+)$/u.exec(n);
  return m ? WEEKDAY_NAMES.findIndex(w => w.some(x => x.toLowerCase() === m[2].toLowerCase())) : -1;
};
/* A name only a schedule uses, so the When button may take the line out of it. */
const isWhenName = n => n === "journals" || /^\d{4}$/.test(n) || weekdayOfName(n) >= 0 ||
  /^\d{2}-\d{2}$/.test(n) || /^\d{4}-\d{2}$/.test(n) || isDateName(n);
/* A name for days that are over: last year's, last month's, yesterday's. */
const isPastWhenName = (n, today = todayISO()) => isDateName(n) ? n < today
  : /^\d{4}/.test(n) && (+n.slice(0, 4) < +today.slice(0, 4) || (/^\d{4}-\d{2}$/.test(n) && n < today.slice(0, 7)));
