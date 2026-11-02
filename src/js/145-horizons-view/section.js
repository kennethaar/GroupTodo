function section(title, count, node, extra, cls) {
  return el("div", {class: cls ? "section " + cls : "section"},
    el("h3", {}, title, count != null ? el("span", {class: "n"}, String(count)) : null, extra || null),
    node);
}
