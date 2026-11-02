function solActBox(r, a) {
  const stack = a.pile != null;
  const box = el("div", {class: "slot solopt" + (a.on ? " on" : "") + (a.now ? " now" : "") + (a.more ? " more" : "") +
      (a.input ? " write" : "") + (stack ? " stack" : "") + (stack && !a.pile ? " bare" : ""),
    tabindex: "0", role: a.input ? null : "button", data: {k: a.k},
    style: stack && a.pile ? "box-shadow:" + solEdges(a.pile) : null,
    title: a.word,
    onclick: e => { if (e.target.closest("input,button")) return; SOL_KB = null; solUnpaint(); solTake(r, box); },
    onkeydown: e => { if ((e.key === "Enter" || e.key === " ") && e.target === box) { e.preventDefault(); e.stopPropagation(); solTake(r, box); } }},
    el("div", {class: "lbl"}, solKeycap(a.k)),
    el("div", {class: "solopt-t"}, a.label),
    a.sub ? el("div", {class: "solopt-s"}, a.sub) : null,
    stack ? el("div", {class: "solpilen"}, a.pile ? a.pile + " " + (r.block ? (a.pile === 1 ? "action" : "actions") : a.pile === 1 ? "project" : "projects") : "none yet") : null);
  if (a.input && a.send) box.append(el("div", {class: "slotform"}, a.input, el("button", {class: "btn sm", onclick: a.send}, "Add")));
  else if (a.input || a.date) box.append(a.input || a.date);
  return box;
}
