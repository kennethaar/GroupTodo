function editBarAct(k) {
  if (!FLY) return;
  const {txt, path, page, block: b} = FLY;
  if (k === "photo" || k === "image") { editBarPickImage(path, b, k === "photo"); return; }
  if (k === "pad") {
    // As Shift+Enter: a notepad box under the line (#392).
    openNoteBox(path, b, txt);
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
