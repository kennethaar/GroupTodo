function fselect(label, value, options, onchange) {
  const s = el("select", {"aria-label": label, onchange: e => onchange(e.target.value)});
  for (const [v, l] of options) s.append(el("option", {value: v}, l));
  s.value = value;
  return s;
}
