/* ---------- what comes first: the action in the middle, the ones that could wait for it round it ---------- */
function npmFirstQ() {
  const loose = npmLoose();
  if (loose.length < 2) return [el("p", {class: "npmsay npmnone"},
    "With one next action, nothing can wait for another. Go on to the last step.")];
  const cur = npmUnplaced(loose)[0], boxes = cur ? npmFirstBoxes(cur, loose) : new Map();
  const grid = el("div", {class: "sol npmsol"});
  for (const g of NPM_GRID) {
    if (g === "CARD") {
      grid.append(el("div", {class: "solpile"}, solKeycap("CARD"),
        el("div", {class: "solcard npmidea"},
          el("div", {class: "npmh"}, cur ? "This action" : "All placed"),
          el("h3", {}, cur ? trim(cur.act.text) : "Each action knows what waits for it."))));
      continue;
    }
    const b = boxes.get(g);
    if (!b) { grid.append(el("div", {class: "slot solempty", "aria-hidden": "true"})); continue; }
    grid.append(el("button", {class: "slot solopt npmbox", disabled: b.off ? "disabled" : null,
      title: "Press " + g, data: {key: g}, onclick: () => npmFirstTake(b.to)},
      el("span", {class: "lbl"}, solKeycap(g), b.lbl),
      el("span", {class: "solopt-t"}, b.t), el("span", {class: "solopt-s"}, b.s)));
  }
  const text = key => trim(loose.find(x => x.key === key)?.act.text || "");
  const placed = (NPM.firstLast || []).filter(k => k in npmBefore() && loose.some(x => x.key === k));
  return [grid,
    loose.length > NPM_FIRST_KEYS.length + 1 ? el("div", {class: "npmsay"}, "That is a lot of next actions for one plan. Some may be a component.") : null,
    ...placed.map(k => el("div", {class: "npmsay"}, text(k) + " → " + (npmParent(k, loose) ? "before " + text(npmParent(k, loose)) : "nothing waits for it"))),
    placed.length ? el("button", {class: "textbtn", title: "Backspace", onclick: npmUndoFirst}, "‹ Undo the last one") : null].filter(Boolean);
}
