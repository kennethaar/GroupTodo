/* ============================================================
   166_REMINDERS -- a toast at the time you wrote, and how long until
   A time on a task is somewhere you have said you will be, so it is the one
   thing in the app that is allowed to speak up on a clock: you asked for it
   when you typed "2pm". Everything else stays as quiet as before -- a task
   with only a day gets no toast, because the Due list already says so.

   There is no server, so a reminder comes from a page that is open. One that
   came due while the app was closed is shown when it opens, up to two hours
   late; past that it is history, not a reminder. What has been shown is kept
   on this device, like read state, and never written into the files.

   Birthdays live on the person, birthday:: 1985-03-14, or 03-14 when the year
   is nobody's business. The day itself gets one toast; the days before it are
   in the birthday box on Today. Meetings have their own countdown at the top,
   so the strip here is the next timed task and the next deadline.
   ============================================================ */
function nowHM() {
  try {
    return new Intl.DateTimeFormat("en-GB", {timeZone: userTZ(), hour: "2-digit",
      minute: "2-digit", hourCycle: "h23"}).format(new Date());
  } catch (_) { const d = new Date(); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); }
}
