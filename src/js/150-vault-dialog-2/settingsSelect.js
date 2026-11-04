/* A list of valid choices as the action of a row. options: [[value, label], ...] */
function settingsSelect(label, options, current, pick) {
  const sel = el("select", {"aria-label": label},
    ...options.map(([v, t]) => el("option", {value: v, selected: v === current ? "" : null}, t)));
  sel.addEventListener("change", () => pick(sel.value));
  return sel;
}
