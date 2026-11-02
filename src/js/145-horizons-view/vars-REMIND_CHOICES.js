/* ---------- the date pill, edited where it is ----------
   Moving a time is the most common edit there is -- "not 16:19, after the
   meeting" -- and it used to cost a trip through the whole task panel. The
   pill opens a small box beside itself instead: the time, the day, a few
   shifts, the reminder, and More... for everything else in the panel. The
   same box opens from a line on a page and from a row in a list. */
const REMIND_CHOICES = [["0", "At the time"], ["5m", "5 min before"], ["10m", "10 min before"],
  ["15m", "15 min before"], ["30m", "30 min before"], ["1h", "1 hour before"], ["2h", "2 hours before"],
  ["1d", "A day before"], ["none", "No reminder"]];
