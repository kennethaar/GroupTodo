function trayTarget(node, accepts, onDrop) {
  node.addEventListener("click", e => {
    const d = TRAY_ARMED;
    if (!d || !accepts(d)) return;
    e.preventDefault(); e.stopPropagation();
    onDrop(d);
  }, true);
  node.addEventListener("dragover", e => { if (TRAY_DRAG && accepts(TRAY_DRAG)) { e.preventDefault(); e.stopPropagation(); node.classList.add("over"); } });
  node.addEventListener("dragleave", () => node.classList.remove("over"));
  node.addEventListener("drop", e => {
    node.classList.remove("over");
    const d = TRAY_DRAG; TRAY_DRAG = null;
    if (!d || !accepts(d)) return;
    e.preventDefault(); e.stopPropagation();
    onDrop(d);
  });
  return node;
}
