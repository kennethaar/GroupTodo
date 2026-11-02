function flattenBlocks(blocks, out = [], parent = null, depth = 0) {
  for (const b of blocks || []) {
    b._parent = parent; b._depth = depth;
    out.push(b);
    flattenBlocks(b.children, out, b, depth + 1);
  }
  return out;
}
