// The same line twice under one parent becomes one, at the first one's place.
function dedupeBlocks(blocks, keep = new Set()) {
  const out = [];
  for (const b of blocks || []) {
    b.children = dedupeBlocks(b.children || [], keep);
    const twin = !keep.has(lineKey(b)) && out.find(x => sameLine(x, b));
    if (twin) foldLine(twin, b); else out.push(b);
  }
  return out;
}
