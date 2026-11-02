/* ============================================================
   110_VIEWS
   Every view is a heading, at most one quiet row of filters, and the work.
   A control appears only when the screen is about it, and a filter always
   shows what it is set to, so an empty list never looks like a bug.
   ============================================================ */
function vhead(title, sub, ...right) {
  right = right.filter(Boolean);
  return el("div", {class: "vhead"}, el("h1", {}, title),
    sub ? el("span", {class: "sub"}, sub) : null,
    right.length ? el("div", {class: "vhead-r"}, ...right) : null);
}
