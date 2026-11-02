/* ---------- meetings: a word before, and the next one at the top ----------
   A meeting is a #meeting line with a time:: on today's day page, or with
   date:: today anywhere else -- the same lines Calendars writes and Alt+M
   makes. The next one is shown at the top of the screen, counting down. How
   many minutes before it the reminder comes is kept on this device (Calendars
   sets it, 0 turns it off); the reminder is a note in the corner and, when the
   browser allows it, a system notification. Each meeting is reminded once. */
const MEET_REMIND_KEY = "meeting.remindMin";
const MEET_REMIND_CHOICES = [0, 5, 10, 15, 30];
const meetRemindMin = () => { const n = parseInt(PREF.get(MEET_REMIND_KEY, "10"), 10); return isFinite(n) && n >= 0 ? n : 10; };
