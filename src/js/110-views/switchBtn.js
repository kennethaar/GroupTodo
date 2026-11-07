/* An on/off setting that stays put, such as Hide done (#321), reads as a
   switch rather than a filter chip: a native button with role="switch", a
   track that slides, the label and, when given, how many it touches. */
function switchBtn(label, on, onclick, count) {
  return el("button", {type: "button", class: "switch", role: "switch", "aria-checked": String(!!on), onclick},
    el("span", {class: "track", "aria-hidden": "true"}), label,
    count != null ? el("small", {}, String(count)) : null);
}
