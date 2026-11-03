function lineSelHud() {
  const n = LINE_SEL.ids.length;
  let hud = $("#lselHud");
  if (!n) { if (hud) hud.remove(); return; }
  if (!hud) { hud = el("div", {id: "lselHud"}); document.body.append(hud); }
  hud.textContent = "";
  hud.append(el("span", {}, n + (n === 1 ? " line picked" : " lines picked")));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => lineSelCopy()}, "Copy"));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => lineSelCut()}, "Cut"));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => lineSelDelete()}, "Delete"));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => lineSelContext()}, "@ Context"));
  if (Spaces.list.length > 1) hud.append(el("button", {class: "btn sm ghost", onclick: () => {
    const got = lineSelBlocks();
    if (!got) return;
    // A picked line's children are picked too, but they travel with it.
    const inner = new Set();
    for (const b of got.blocks) walkBlocks(b.children, c => { inner.add(c); });
    const items = got.blocks.filter(b => !inner.has(b)).map(b => ({space: V.space, path: LINE_SEL.path, id: b.id}));
    lineSelClear();
    openMoveLinesToArea(items);
  }}, "To area"));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => {
    const got = lineSelBlocks();
    if (!got) return;
    const src = planSourceOfLines(LINE_SEL.path, got.blocks);
    lineSelClear();
    openPlanWithAI(src);
  }}, "Plan with AI"));
  // Lines already in the page can become a page of their own, as a paste can.
  hud.append(el("button", {class: "btn sm ghost", onclick: () => {
    const got = lineSelBlocks();
    if (!got) return;
    const path = LINE_SEL.path;
    lineSelClear();
    offerPasteAs(linesAsText(got.blocks), "Make a page of the " + got.blocks.length +
      (got.blocks.length === 1 ? " picked line:" : " picked lines:"),
      pasteSwapper(path, got.blocks, (kind, link) => newBlock({title: link}, false)));
  }}, "Make a page"));
  hud.append(el("button", {class: "btn sm ghost", onclick: () => lineSelClear()}, "Let go"));
  hud.append(el("span", {class: "k"}, "shift-↑↓ more · alt-shift-↑↓ move · ctrl-enter task state · . .. ... time · @ context · ctrl-c · ctrl-x · ctrl-v · del · esc"));
}
