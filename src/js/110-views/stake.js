function stake(label, face, onRemove) {
  return el("span", {class: "stake"}, face, label,
    el("button", {"aria-label": "Remove " + label, onclick: e => { e.stopPropagation(); onRemove(); }}, "×"));
}
