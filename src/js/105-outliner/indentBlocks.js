/* Tab and shift-tab on picked lines: each goes in under the line above it or
   out beside its parent, as one line does. Picked lines side by side go in
   together under the same line, so they stay siblings; one that cannot go in
   (nothing above it) keeps the picked lines after it from going in under it. */
function indentBlocks(page, blocks, out) {
  let moved = false;
  if (out) {
    // Last first, so each lands ahead of the ones already out and the order holds.
    for (const b of blocks.slice().reverse()) {
      const par = parentOf(page, b);
      if (!par) continue;
      const sibs = siblingsOf(page, b), gsibs = siblingsOf(page, par);
      sibs.splice(sibs.indexOf(b), 1);
      gsibs.splice(gsibs.indexOf(par) + 1, 0, b);
      moved = true;
    }
    return moved;
  }
  const stuck = new Set();
  for (const b of blocks) {
    const sibs = siblingsOf(page, b), i = sibs.indexOf(b), prev = sibs[i - 1];
    if (!prev || stuck.has(prev)) { stuck.add(b); continue; }
    sibs.splice(i, 1);
    (prev.children || (prev.children = [])).push(b);
    prev.collapsed = false;
    moved = true;
  }
  return moved;
}
