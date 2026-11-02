/* Making a new one of what the view lists. Always in the heading, always
   worded the same, so it is where you look on every screen. */
const newBtn = (what, onclick) => el("button", {class: "textbtn newbtn", onclick}, "+ New " + what);

/* ---------- a text filter over a list ----------
   Every word typed has to be somewhere in what hay(row) says about a row. Only
   the list is drawn again, so typing never loses its place to a re-render,
   and what was typed is kept per view for as long as the app is open.
   draw(hits, query) returns what goes under the filter row. */
const LIST_Q = new Map();
