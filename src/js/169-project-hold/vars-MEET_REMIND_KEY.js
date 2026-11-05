/* ---------- meetings: a word before, and the next one at the top ----------
   A meeting is a #meeting line with a time:: on today's day page, or with
   date:: today anywhere else -- the same lines Calendars writes and Alt+M
   makes. The next one is shown at the top of the screen, counting down. How
   many minutes before it the reminder comes is kept on this device (Calendars
   sets it, 0 turns it off); the reminder is a note in the corner and, when the
   browser allows it, a system notification. Each meeting is reminded once. */
const MEET_REMIND_KEY = "meeting.remindMin";
/* Kept as "off", "start" or the minutes before; a "0" from before At start existed means off. */
const MEET_REMIND_CHOICES = [["off", "Off"], ["start", "At start"], ["5", "5 min before"], ["10", "10 min before"],
  ["15", "15 min before"], ["30", "30 min before"], ["60", "1 hour before"]];
// Minutes before the start to remind, 0 at the start, or null for no reminder.
const meetRemindLead = () => {
  const v = PREF.get(MEET_REMIND_KEY, "10");
  if (v === "start") return 0;
  if (v === "off" || v === "0") return null;
  const n = parseInt(v, 10);
  return isFinite(n) && n > 0 ? n : 10;
};
