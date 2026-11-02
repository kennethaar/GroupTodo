function flyAfter(k) {
  const id = FLY.block.id;
  /* The redraw takes the line away, and losing focus is what writes a line's
     words back -- so it is handed the words as they are now, or it would put
     the old ones back over the link that was just added. */
  FLY.txt.textContent = FLY.block.title;
  FLY_LIT = {id, k};
  setTimeout(() => { if (FLY_LIT && FLY_LIT.id === id && FLY_LIT.k === k) { FLY_LIT = null; if (FLY) flyDraw(); } }, 900);
  noteTodoTouched();
  render();
  focusBlock(id);
}
