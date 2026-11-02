function fchip(label, on, onclick, count) {
  return el("button", {class: "fchip", "aria-pressed": String(!!on), onclick},
    label, count != null ? el("small", {}, String(count)) : null);
}
