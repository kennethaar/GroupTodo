/* ---------- the day page, while something is happening ----------
   A meeting, a chapter, a lecture: the hard part is never the notes, it is the
   twenty minutes afterwards that nobody has, where the notes were supposed to
   become tasks. So the day page is built to be typed into while the thing is
   still going on: write the line, and decide later -- or decide with two keys,
   on the spot.

   Which means the only two things worth teaching here are the two that cost
   nothing in the moment: Ctrl+Enter, which makes a line a task, and Tab, which
   says what a line belongs to. Everything else can wait for the weekly review.

   Shown on day pages, with the examples written the way they are written in
   the page, because the indentation is half of what it is saying. One example
   from a meeting and one from a book, because the page does not care which it
   was and people who only ever saw the meeting one think it does. Closed for
   good with the X: somebody who has taken notes in here twice does not need
   to be told a third time. */
const meetingTipOff = () => PREF.get("tip.off.meeting", "") === "1";
