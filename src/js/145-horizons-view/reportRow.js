function reportRow(r) {
  return el("button", {class: "reprow",
    onclick: () => inSpace(r.space, () => openTaskDetail(r.path, r.block, r.space))},
    el("span", {class: "when", title: r.approx ? "No done date was recorded - this is the day page it was written on" : null},
      (r.approx ? "approx. " : "") + humanDate(r.when)),
    el("span", {class: "what", translate: "no", html: renderInline(titleForRow(r.title))}),
    el("span", {class: "marks"},
      r.org ? el("span", {class: "chip"}, r.org) : null,
      r.project ? el("span", {class: "chip proj"}, r.project) : null,
      r.who ? el("span", {class: "chip who"}, r.who) : null));
}
