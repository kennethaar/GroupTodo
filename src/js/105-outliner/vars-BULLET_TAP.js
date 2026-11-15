/* The last tap on a note's bullet, kept outside the bullet itself so a redraw
   between two taps does not forget the first. A phone's double tap comes as two
   clicks of detail 1, often 300 ms apart, so the gap is timed here (#400). */
const BULLET_TAP = {id: null, at: 0, timer: 0};
const BULLET_DOUBLE_MS = 400;
