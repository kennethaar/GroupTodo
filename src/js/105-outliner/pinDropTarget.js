/* #448 A page pinned in the sidebar, dragged onto a line, becomes a line of
   its own that links the page: below the line it was dropped on, or last when
   dropped on New line. A bar shows where it lands. A pin from another area,
   or of this very page, is not taken. */
function pinDropTarget(node, path, cls, place) {
  const fits = () => !!PIN_DRAG && PIN_DRAG.path !== path && (!PIN_DRAG.space || PIN_DRAG.space === V.space);
  node.addEventListener("dragover", e => {
    if (!fits()) return;
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "link"; } catch (_) {}
    node.classList.add(cls);
  });
  node.addEventListener("dragleave", () => node.classList.remove(cls));
  node.addEventListener("drop", e => {
    node.classList.remove(cls);
    if (!fits()) return;
    e.preventDefault();
    e.stopPropagation();
    const pin = PIN_DRAG;
    PIN_DRAG = null;
    place(newBlock({title: "[[" + pageRef(pin.path) + "]]"}));
    touch(path);
    render();
  });
}
