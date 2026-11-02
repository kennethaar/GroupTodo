function prevValueEl(path, key) {
  const p = prevValue(path, key);
  if (!p) return null;
  return el("span", {class: "prevval", contenteditable: "false", title: "What you wrote on " + humanDate(p.date)},
    "last " + p.value + " · " + humanDate(p.date));
}
