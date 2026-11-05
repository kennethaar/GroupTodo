/* One screen of the Calendars dialog. A screen below the first has a way back
   to the one above it, in the title, where ✕ already is the way out. */
function calScreen({title, back = null, backTo = null, hint = null, body, foot = null}) {
  const head = el("span", {class: "calhead"},
    back ? el("button", {class: "textbtn", onclick: backTo}, "‹ " + back) : null, el("span", {}, title));
  return modal({center: true, title: head, hint, body, foot});
}
/* A row that opens a screen: the name, what it is set to beneath, and ›. */
function calRow(title, sub, onclick) {
  return el("button", {class: "pick calrow", onclick},
    el("span", {class: "calrowt"}, el("span", {}, title), sub ? el("span", {class: "sub"}, sub) : null),
    el("span", {class: "chev", "aria-hidden": "true"}, "›"));
}
/* A fact that is not a field: small name, plain value. */
function calFact(label, value) {
  return el("div", {class: "calfact"}, el("div", {class: "lbl"}, label), el("div", {}, value));
}
