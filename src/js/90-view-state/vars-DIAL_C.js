/* ---------- the timer as a dial ----------
   A clock face beside the time: the coloured part is what is left out of
   max:: minutes, with 0 at the top, and it shrinks clockwise back to 0 as the
   time runs. Only the four quarters are marked, and while you set it their
   minutes are written outside the rim, counter-clockwise from 0 the way a
   Time Timer has them.
   A click starts the usual length, silent; the bell starts it with the alarm.
   Press and drag to pick the minutes, as far as you drag, TIMER_PX a minute,
   the way the bar does: up rings, left or any other way is silent, and Ctrl
   makes any drag ring. Letting go starts it. The wheel (down adds) and the
   arrow keys nudge it, and it starts a moment after you stop. The bell is
   solid while the alarm is on. */
const DIAL_C = 28, DIAL_R = 25, DIAL_PAD = 9;   // the numbers sit in the pad outside the rim
