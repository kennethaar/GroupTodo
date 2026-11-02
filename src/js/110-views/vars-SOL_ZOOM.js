/* ---------- the table under the card you are moving ----------
   Only one box is ever enlarged: the one the pointer is in, or the one it is
   heading straight for within 60px. The other boxes stay exactly as they are.
   The box is scaled with a transform, never resized, so its words do not
   re-wrap and jump away from the pointer. Each box is one answer, so letting
   go anywhere on it takes that answer; an arrow from the card to it says
   what that will do. The keyboard drives the same zoom (see below). */
const SOL_ZOOM = 1.45, SOL_LEAD = 60;
const SOL_TWICE_MS = 450;   // 5 pressed twice within this skips the project
let SOL_FIVE_AT = 0;
const solZoomOn = () => matchMedia("(min-width: 761px)").matches;
const solReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let SOL_DRAG = null, SOL_KB = null, SOL_ARROW = null;

const solBoxes = () => [...document.querySelectorAll(".sol [data-k]")];
const solBox = k => k ? document.querySelector('.sol [data-k="' + k + '"]') : null;
const solCardEl = () => document.querySelector(".sol .solpile .solcard");
/* The pills of a box: its options, its "Show all", or for a box with none (a
   text field, an answered card) the box itself. */
const solPills = box => box ? [box] : [];
const solMid = r => [r.left + r.width / 2, r.top + r.height / 2];
const solDist = (r, x, y, pad = 0) => Math.hypot(Math.max(r.left - pad - x, 0, x - r.right - pad), Math.max(r.top - pad - y, 0, y - r.bottom - pad));
const solInside = (r, x, y) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
