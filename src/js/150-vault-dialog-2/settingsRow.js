/* One line of Settings: label, what it is now, and the one thing to do about it.
   `value` and `action` are text or nodes; either may be left out. */
function settingsRow(label, value, action, cls) {
  return el("div", {class: "srow" + (cls ? " " + cls : "")},
    el("span", {class: "slabel"}, label),
    value == null || value === "" ? null : el("span", {class: "sval"}, value),
    action || null);
}
