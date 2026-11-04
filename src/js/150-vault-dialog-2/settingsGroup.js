function settingsGroup(title, rows, cls) {
  return el("div", {class: "sgroup" + (cls ? " " + cls : "")},
    title ? el("h3", {}, title) : null, ...rows.filter(Boolean));
}
