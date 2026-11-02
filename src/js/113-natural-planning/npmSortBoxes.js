/* ---------- organise: the idea in the middle, where it can go round it ---------- */
function npmSortBoxes() {
  const boxes = new Map();
  NPM.comps.forEach((c, n) => {
    if (n >= NPM_COMP_KEYS.length) return;
    const count = NPM.ideas.filter(i => i.to === "c:" + c.id).length;
    boxes.set(NPM_COMP_KEYS[n], {lbl: "Component " + (n + 1), t: c.name, s: count + (count === 1 ? " idea" : " ideas"), to: "c:" + c.id});
  });
  const free = NPM_COMP_KEYS[NPM.comps.length];
  if (free) boxes.set(free, {lbl: "New", t: "+ New component", s: "A part of the project (" + (NPM.comps.length + 1) + " of 4)", to: "new", more: true});
  boxes.set("6", {lbl: "Action", t: "Next action", s: "Already something to do", to: "next"});
  boxes.set("1", {lbl: "Support", t: "Reference", s: "Good to know, not to do", to: "support"});
  boxes.set("2", {lbl: "Later", t: "Someday", s: "Not in this round", to: "later"});
  boxes.set("3", {lbl: "Trash", t: "Not needed", s: "Kept in the brainstorm only", to: "trash"});
  return boxes;
}
