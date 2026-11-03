function bookChapterRow(row, i, name) {
  row.draggable = true;
  row.dataset.ch = name;
  const refocus = () => requestAnimationFrame(() =>
    [...document.querySelectorAll(".bookch")].find(r => r.dataset.ch === name)?.querySelector(".nm")?.focus());
  row.addEventListener("dragstart", e => {
    BOOK_DRAG = i; row.classList.add("dragging");
    try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", name); } catch (_) {}
  });
  row.addEventListener("dragend", () => { BOOK_DRAG = null; row.classList.remove("dragging"); });
  row.addEventListener("dragover", e => {
    if (BOOK_DRAG == null || BOOK_DRAG === i) return;
    e.preventDefault(); row.classList.add(BOOK_DRAG < i ? "over-after" : "over-before");
  });
  row.addEventListener("dragleave", () => row.classList.remove("over-after", "over-before"));
  row.addEventListener("drop", e => {
    row.classList.remove("over-after", "over-before");
    const from = BOOK_DRAG; BOOK_DRAG = null;
    if (from == null || from === i) return;
    e.preventDefault();
    moveBookChapterTo(from, i);
  });
  row.addEventListener("keydown", e => {
    if (!e.altKey || !e.shiftKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
    e.preventDefault(); e.stopPropagation();
    const to = i + (e.key === "ArrowUp" ? -1 : 1);
    if (to < 0 || to >= bookChapters().length) return;
    moveBookChapterTo(i, to);
    refocus();
  });
  return row;
}
