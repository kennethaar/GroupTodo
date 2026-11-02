/* ---------- a word on what you finish ----------
   Finishing something is the moment you know how it went, so a corner toast
   offers a line about it: an indented line under the todo, or the last line
   of the project page, with today's date first -- [[2026-10-16]] ... Finish
   several and they stack in the one toast, which stays 30 seconds, or 5 for
   each item in it when that is longer, counted from the last one added. It
   waits while you are typing in it, and Esc or the cross lets it go.

   What you finished is kept in a history on this device (g h), so the comment
   can come later too, once you know more. */
const DONE_HIST_MAX = 200;
const DONE_TOAST = {el: null, list: null, count: null, n: 0, timer: null};
