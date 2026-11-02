function walkBlocks(blocks, fn, parent = null) {
  for (const b of blocks || []) {
    if (fn(b, parent) === false) continue;
    walkBlocks(b.children, fn, b);
  }
}
