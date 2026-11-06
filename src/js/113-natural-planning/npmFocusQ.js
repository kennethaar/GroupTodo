/* ---------- off your mind? Up is clearer, down is action, right is done ---------- */
function npmFocusQ() {
  const ready = npmItems().filter(it => trim(it.act.text || "") || (it.kind === "comp" && npmKept(it.c))).length;
  const boxes = new Map([
    ["8", {lbl: [svgIcon(ICON_ARROW_UP), " Needs clarity"], t: "Still fuzzy", s: "Back to why and the outcome", go: () => npmGo(0)}],
    ["6", {lbl: [svgIcon(ICON_CHECK), " Off my mind"], t: "Write the page", s: "One change; Undo takes it back", go: npmWrite, ok: true}],
    ["2", {lbl: [svgIcon(ICON_ARROW_DOWN), " Needs action"], t: "Missing a step", s: "Back to the next actions", go: () => npmGo(4)}],
  ]);
  const grid = el("div", {class: "sol npmsol"});
  for (const g of NPM_GRID) {
    if (g === "CARD") {
      grid.append(el("div", {class: "solpile"}, el("div", {class: "solcard npmidea"},
        el("div", {class: "npmh"}, "The plan"),
        el("h3", {}, trim(NPM.outcome) || "No outcome yet"),
        el("div", {class: "npmsay"}, NPM.comps.length + (NPM.comps.length === 1 ? " component · " : " components · ") +
          ready + (ready === 1 ? " next action ready" : " next actions ready")))));
      continue;
    }
    const b = boxes.get(g);
    grid.append(!b ? el("div", {class: "slot solempty", "aria-hidden": "true"})
      : el("button", {class: "slot solopt npmbox" + (b.ok ? " on" : ""), data: {key: g}, title: "Press " + g, onclick: b.go},
          el("span", {class: "lbl"}, solKeycap(g), b.lbl), el("span", {class: "solopt-t"}, b.t), el("span", {class: "solopt-s"}, b.s)));
  }
  return [grid, el("div", {class: "npmnav"}, el("button", {class: "btn ghost", onclick: npmBack}, svgIcon(ICON_CHEVRON_LEFT), " Back"))];
}
