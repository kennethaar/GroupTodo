/* ---------- the day pages, decided on ----------
   The day page is the inbox: what you write in a meeting or between two
   things lands there as plain lines. A line that should have been a task and
   never became one is asked about nowhere else, so it is a promise nobody
   keeps. So the review deals the loose lines of your own day pages one at a
   time, oldest first, the way the projects are dealt, and asks the one GTD
   question: what is it? Something to do (a to do, a waiting-for, a
   project), something for later (someday/maybe, an idea of its own), or
   nothing to do (done already, or a note that stays). When every line of a
   day is answered the day is stamped clarified:: and not asked about again.

   Only the last two weeks: older days are history, and the first review
   should not open with a year of them. Meeting lines from a calendar are
   not asked about (what is written under them is). */
const DAY_REVIEW_DAYS = 14;
// An event or a feeling is something that happened, never a to do (#185).
const dayCandidate = b => !b.state && !isMessage(b) && !isMeeting(b) && !bujoKind(b.title) &&
  !!trim(plainTitle(b.title || "")) && !/^\s*[\w-]+::/.test(b.title || "");
