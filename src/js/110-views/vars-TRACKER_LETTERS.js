/* ============================================================
   TRACKERS -- something written down on a day, to watch over time
   A tracker is a line on a day page:

     tracker-<what>_<code>:: <values>      tracker-pullups_krrr:: 100/8/4/2

   It is only where it is written, by hand or poured in by a journal template
   such as pages/8/2026-Monday.md. The code says what each value is, one
   letter each, and the values are split by "/". Without a code the value is
   one number. What is being tracked is the part before the underscore, so
   changing the code later keeps the history in one graph. Only day pages
   count: a tracker anywhere else has no day to be on.

   Three letters take the whole line as one value, written the way it is
   said, and are what the sheets add up (see SHEETS below):
     tracker-office_t:: 07:12 - 10:00, 10:30 - 12:30 start and end; "07:12 -" is still running
     tracker-food_a:: 129,50 + 45                    an amount, several with +
     tracker-paint_q:: +3                            stock: +3 in, -1 out, =12 counted
   And one is tapped rather than typed (see TAP TO COUNT):
     tracker-coffee_i:: ☕☕☕                         a count, one icon a tap
   ============================================================ */
const TRACKER_LETTERS = {
  k: {word: "kilos", unit: "kg"},
  r: {word: "reps"},
  n: {word: "number"},
  m: {word: "minutes", unit: "min"},
  c: {word: "done or not"},
  s: {word: "rating 1-10"},
  t: {word: "start and end"},
  a: {word: "amount"},
  q: {word: "in and out"},
  i: {word: "tap to count"},
};
const wholeLineTracker = code => /^[taqi]$/.test(code || "");
const TRACKER_RE = /^tracker-([\p{L}\p{N}_-]+?)(?:_([krnmcstaqi]+))?::[ \t ]*(.*)$/iu;
