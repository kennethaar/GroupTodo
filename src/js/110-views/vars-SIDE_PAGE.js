/* ---------- a page, docked beside the view ----------
   The full page in a narrow pane at the right, next to what you were looking
   at rather than over it: both stay usable, so a small change there does not
   cost you your place. ⤢ makes it the page on screen, ✕ puts it away.
   render() draws it again with everything else.

   📌 pins it there: a pinned page stays through every view and a reload, on
   this device, until it is unpinned -- notes kept open while you move about.
   A page looked at beside the view goes over the pin, and ✕ on it brings the
   pin back. Today's day page pinned stays today's when the day turns. A
   bullet clicked in the pane focuses the pane on that line, and pinned that
   way the pin is the line and what is under it, found again by its id::. */
let SIDE_PAGE = null;   // {space, path, branch} while a page is looked at beside the view
let SIDE_SHOWN = null;  // the one drawn there now, the pin or the look
let SIDE_DRAWING = false;
/* A page opened from the card on the review table follows the table: the next
   card dealt is the page shown, until the pane is closed or another page is
   looked at there (#177). */
let SIDE_FOLLOW = false;
const NARROW = window.matchMedia("(max-width:820px)");
// A phone's width: the Journal draws what is due another way there (#209).
const PHONE = window.matchMedia("(max-width:640px)");
/* The capture field's long example is cut off on a phone; there it says only
   what it is for. */
const CAP_HINT = $("#cap")?.getAttribute("placeholder") || "";
