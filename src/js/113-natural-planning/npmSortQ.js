function npmSortQ() {
  // Nothing to sort: no table of boxes that do nothing, just the way back.
  if (!NPM.ideas.length) return [el("p", {class: "npmsay npmnone"}, "Nothing to sort yet. Organise sorts the ideas from the brainstorm."),
    el("button", {class: "btn primary", onclick: () => npmGo(NPM_STEPS.findIndex(s => s.k === "brainstorm"))}, "‹ Brainstorm"),
    el("p", {class: "npmsay"}, "No ideas? Skip on to the next actions.")];
  const idea = npmUnsorted()[0], boxes = npmSortBoxes();
  const grid = el("div", {class: "sol npmsol"});
  for (const g of NPM_GRID) {
    if (g === "CARD") {
      grid.append(el("div", {class: "solpile"}, solKeycap("CARD"),
        el("div", {class: "solcard npmidea"},
          el("div", {class: "npmh"}, idea ? "This idea" : NPM.ideas.length ? "All sorted" : "No ideas yet"),
          el("h3", {}, idea ? idea.t : NPM.ideas.length ? "Every idea has a place." : "Go back a step and brainstorm."))));
      continue;
    }
    const b = boxes.get(g);
    if (!b) { grid.append(el("div", {class: "slot solempty", "aria-hidden": "true"})); continue; }
    if (b.to === "new" && NPM.naming && idea) {
      const input = el("input", {class: "npmin", value: idea.t, "aria-label": "Name of the component"});
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); npmMakeComp(input.value); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); NPM.naming = false; render(); }
      });
      requestAnimationFrame(() => { input.focus(); input.select(); });
      grid.append(el("div", {class: "slot solopt write"},
        el("span", {class: "lbl"}, solKeycap(g), "Name it"), input,
        el("span", {class: "solopt-s"}, "Enter makes it")));
      continue;
    }
    grid.append(el("button", {class: "slot solopt npmbox" + (b.more ? " more" : ""), disabled: idea ? null : "disabled",
      title: "Press " + g, data: {key: g}, onclick: () => npmSortTake(b.to)},
      el("span", {class: "lbl"}, solKeycap(g), b.lbl),
      el("span", {class: "solopt-t"}, b.t), el("span", {class: "solopt-s"}, b.s)));
  }
  return [grid,
    NPM.comps.length >= NPM_COMP_KEYS.length ? el("div", {class: "npmsay"}, "Four components is plenty to hold in mind. More is a second project.") : null,
    NPM.last.length ? el("button", {class: "textbtn", title: "Backspace", onclick: npmUndoSort}, "‹ Undo last sort") : null].filter(Boolean);
}
