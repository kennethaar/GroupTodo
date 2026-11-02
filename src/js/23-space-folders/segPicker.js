/* A row of mutually exclusive buttons with the chosen one's one-line reason
   under it. Items are {key, label, blurb}. A radiogroup, so a screen reader
   hears which one is picked, and the reason follows the pick. */
function segPicker(items, current, onPick) {
  const row = el("div", {class: "seg", role: "radiogroup"});
  const why = el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"});
  const paint = key => {
    for (const b of row.children) {
      const on = b.dataset.k === key;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    }
    why.textContent = items.find(i => i.key === key)?.blurb || "";
  };
  for (const it of items) {
    const b = el("button", {type: "button", role: "radio", onclick: () => {
      if (b.classList.contains("on")) return;
      paint(it.key);
      onPick(it.key);
    }}, it.label);
    b.dataset.k = it.key;
    row.append(b);
  }
  paint(current);
  return el("div", {}, row, why);
}
