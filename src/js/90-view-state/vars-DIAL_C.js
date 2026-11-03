/* ---------- the timer as a dial ----------
   A clock face beside the time: the coloured part is what is left out of
   max:: minutes, with 0 at the top, and it shrinks clockwise back to 0 as the
   time runs. Only the four quarters are marked, and while you set it their
   minutes are written outside the rim, counter-clockwise from 0 the way a
   Time Timer has them.
   Click or drag on the face: the angle is the minutes, and how far out says
   the alarm. Inside the DIAL_RING ring it is silent, outside it rings. A drag
   may cross the ring, or leave the face, and keeps its minutes. Letting go
   starts it. The middle, inside DIAL_HUB, starts the usual length or stops.
   The bell turns the alarm on or off, even while it runs. The wheel (down
   adds) and the arrow keys nudge it, and it starts a moment after you stop.
   The bell is solid, and the wedge amber, while the alarm is on. */
const DIAL_C = 28, DIAL_R = 25, DIAL_PAD = 9;   // the numbers sit in the pad outside the rim
const DIAL_HUB = 0.1, DIAL_RING = 0.6;          // shares of the radius
