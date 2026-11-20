/* The sorting card on the table, as Natural planning's What comes first: the
   step in the middle, the other sequences round it, 6 for No. */
function actSortTable(c, r) {
  const cur = actSortNow(r), roots = actSortRoots(r);
  const others = roots.filter(b => b !== cur).slice(0, NPM_FIRST_KEYS.length);
  const boxes = new Map(others.map((b, n) => [NPM_FIRST_KEYS[n],
    {lbl: "Waits for", t: actSortTitle(b), s: (b.children || []).some(x => OPEN_STATES[x.state]) ? "A sequence already" : "", to: b}]));
  boxes.set("6", {lbl: "No", t: "No, it can go now", s: "Nothing comes first", to: ""});
  const project = inS(r, () => pageTitle(r.path));
  const grid = el("div", {class: "sol npmsol"});
  for (const g of NPM_GRID) {
    if (g === "CARD") {
      grid.append(el("div", {class: "solpile"}, solKeycap("CARD"),
        el("div", {class: "solcard npmidea"},
          el("div", {class: "npmh", translate: "no"}, project + " · " + (ACT_SORT.asked.length + 1) + " of " + roots.length),
          el("h3", {translate: "no"}, actSortTitle(cur)),
          el("div", {class: "solq"}, el("b", {}, "Does it wait for another step?")))));
      continue;
    }
    const b = boxes.get(g);
    if (!b) { grid.append(el("div", {class: "slot solempty", "aria-hidden": "true"})); continue; }
    grid.append(el("button", {class: "slot solopt npmbox", title: "Press " + g, data: {key: g}, onclick: () => actSortTake(r, b.to)},
      el("span", {class: "lbl"}, solKeycap(g), b.lbl),
      el("span", {class: "solopt-t", translate: "no"}, b.t), el("span", {class: "solopt-s"}, b.s)));
  }
  c.append(el("div", {class: "soltable actsort"}, el("div", {class: "actsortcol"},
    el("p", {class: "solhow"}, project + " has " + roots.length + " steps that can all go now. Sort them into sequences, so only the very next one of each is asked about. Press a box's number to answer."),
    grid,
    el("p", {},
      el("button", {class: "textbtn", onclick: () => actSortTake(r, "all")}, "They can all go at once"),
      ACT_SORT.past.length ? " · " : null,
      ACT_SORT.past.length ? el("button", {class: "textbtn", title: "Backspace", onclick: () => actSortUndo(r)}, "‹ Undo the last one") : null))));
  return c;
}
