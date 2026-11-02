function trayChip(kind, name, face) {
  const chip = el("span", {class: "pchip", draggable: "true", title: "Drag onto a project" + (kind === "person" ? " or a next action" : "")},
    face, el("span", {}, name));
  chip.addEventListener("dragstart", e => { TRAY_DRAG = {kind, name}; try { e.dataTransfer.setData("text/plain", name); } catch (_) {} });
  chip.addEventListener("dragend", () => { TRAY_DRAG = null; });
  return chip;
}
