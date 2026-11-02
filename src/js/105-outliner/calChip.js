/* Calendars on Today: the button says when they were last fetched, and the
   arrow next to it fetches now. Kept current in place, without a redraw. */
function calChip() {
  const open = el("button", {class: "btn ghost calchip", onclick: openCalendars});
  const now = el("button", {class: "btn ghost calrefresh", "aria-label": "Fetch calendars now",
    onclick: () => syncCalendars({quiet: false})}, el("span", {class: "calspin", "aria-hidden": "true"}, "↻"));
  const wrap = el("span", {class: "calgroup"}, open, now);
  fillCalChip(wrap);
  return wrap;
}
