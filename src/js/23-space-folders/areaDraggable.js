function areaDraggable(node, name, after) {
  node.draggable = true;
  node.addEventListener("dragstart", e => {
    AREA_DRAG = name; node.classList.add("dragging");
    try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", name); } catch (_) {}
  });
  node.addEventListener("dragend", () => { AREA_DRAG = null; node.classList.remove("dragging"); });
  node.addEventListener("dragover", e => {
    if (!AREA_DRAG || AREA_DRAG === name) return;
    e.preventDefault(); node.classList.add("over");
  });
  node.addEventListener("dragleave", () => node.classList.remove("over"));
  node.addEventListener("drop", async e => {
    node.classList.remove("over");
    const moving = AREA_DRAG; AREA_DRAG = null;
    if (!moving || moving === name) return;
    e.preventDefault();
    if (await Spaces.move(moving, Spaces.list.findIndex(s => s.name === name))) { render(); after(); }
  });
  return node;
}
