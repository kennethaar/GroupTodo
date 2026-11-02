function pullUpLine(txt, path, page, b) {
  const outline = txt.closest(".outline");
  if (!outline) return false;
  const all = $$(".txt, .bodyline", outline);
  const above = all[all.indexOf(txt) - 1];
  const id = above?.closest(".blk")?.dataset.id;
  if (!id) return false;
  const target = findBlock(id);
  if (!target || target.path !== path) return false;
  const t = target.block;
  // Blur is what writes the line back, so let it, then take what it wrote.
  txt.blur();
  const text = b.title || "";
  const sibs = siblingsOf(page, b), i = sibs.indexOf(b);
  const kids = b.children || [];
  if (t === parentOf(page, b)) sibs.splice(i, 1, ...kids);
  else {
    sibs.splice(i, 1);
    if (kids.length) { (t.children || (t.children = [])).push(...kids); t.collapsed = false; }
  }
  if ((b.body || []).length) (t.body || (t.body = [])).push(...b.body);
  if ((b.drawers || []).length) (t.drawers || (t.drawers = [])).push(...b.drawers);
  let sel, at;
  if (above.classList.contains("bodyline")) {
    const bi = Number(above.dataset.bi);
    at = t.body[bi].length;
    t.body[bi] += text;
    sel = `.blk[data-id="${t.id}"] > .bodyline[data-bi="${bi}"]`;
  } else {
    at = (t.title || "").length;
    t.title = (t.title || "") + text;
    sel = `.blk[data-id="${t.id}"] .txt`;
  }
  createLinkedPages(text);
  touch(path); noteTodoTouched(); render();
  focusLineAt(sel, at);
  return true;
}
