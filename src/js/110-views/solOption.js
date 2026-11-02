function solOption(r, f, v, label, on, now) {
  return el("button", {class: "fchip" + (now ? " now" : ""), "aria-pressed": String(!!on),
    data: {solDrop: f.k + "~" + v},
    onclick: e => { e.stopPropagation(); solApply(r, f, v); }}, label + (now ? " (now)" : ""));
}
