function editBarAct(k) {
  if (!FLY) return;
  const {txt, path, page, block: b} = FLY;
  if (k === "photo" || k === "image") { editBarPickImage(path, b, k === "photo"); return; }
  if (k === "pad") {
    // As Shift+Enter: blur writes the line back, then the notepad opens at the caret.
    const at = caretOffsets(txt)[0];
    txt.blur();
    openNotepad(path, b, at);
    return;
  }
  const top = txt.getBoundingClientRect().top;
  if (k === "up" || k === "down" || k === "in" || k === "out") {
    txt.blur();
    const moved = k === "up" || k === "down" ? shiftBlocks(page, [b], k === "up" ? -1 : 1)
                                             : indentBlocks(page, [b], k === "out");
    if (moved) { touch(path); noteTodoTouched(); render(); }
  } else flyHead(k);
  editBarRefocus(b.id, top);
}
