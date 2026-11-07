/* ============================================================
   110_VIEWS
   Every view is a heading, at most one quiet row of filters, and the work.
   A control appears only when the screen is about it, and a filter always
   shows what it is set to, so an empty list never looks like a bug.
   ============================================================ */
function vhead(title, sub, ...right) {
  right = right.filter(Boolean);
  /* A view opened from another has its way back as a quiet link above the
     title, on a line of its own (P15, #318). */
  const from = VIEW_BACK[state.view];
  return el("div", {class: "vhead"},
    from ? el("div", {class: "vback"},
      el("button", {class: "textbtn", onclick: () => go(from[0])}, "‹ " + from[1])) : null,
    el("h1", {}, title),
    sub ? el("span", {class: "sub"}, sub) : null,
    right.length ? el("div", {class: "vhead-r"}, ...right) : null);
}
