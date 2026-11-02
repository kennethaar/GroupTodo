function pickRow(key, label, detail, onclick) {
  return el("button", {class: "pick", onclick},
    el("span", {class: "k"}, key), el("span", {}, label),
    detail ? el("span", {class: "d"}, detail) : null);
}
