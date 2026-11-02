function flyShow(txt, path, page, block) {
  flyHide();
  const blk = txt.closest(".blk"), line = txt.closest(".line");
  if (!blk || !line) return;
  const box = el("div", {class: "fly", role: "menu", "aria-label": "Line options"});
  /* Nothing in the menu takes focus from the line: the line closes the menu
     when it loses focus, so even the date chip only asks for its calendar. */
  box.addEventListener("mousedown", e => e.preventDefault());
  document.body.append(box);
  FLY = {txt, path, page, block, box, open: null, hi: 0, q: ""};
  if (FLY_OPEN_AFTER && FLY_OPEN_AFTER.id === block.id) { FLY.open = FLY_OPEN_AFTER.k; FLY_OPEN_AFTER = null; }
  flyDraw();  editBarSync();
}
