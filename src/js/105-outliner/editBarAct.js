function editBarAct(k) {
  if (!FLY) return;
  const {txt, path, page, block: b} = FLY;
  if (k === "photo" || k === "image") { editBarPickImage(path, b, k === "photo"); return; }
  if (k === "area") { txt.blur(); openMoveLinesToArea([{space: V.space, path, id: b.id}]); return; }
  const top = txt.getBoundingClientRect().top;
  if (k === "up" || k === "down" || k === "in" || k === "out") {
    txt.blur();
    const moved = k === "up" || k === "down" ? shiftBlocks(page, [b], k === "up" ? -1 : 1)
                                             : indentBlocks(page, [b], k === "out");
    if (moved) { touch(path); noteTodoTouched(); render(); }
  } else flyHead(k);
  editBarRefocus(b.id, top);
}
