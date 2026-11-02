function branchTrail(blocks, id, trail = []) {
  for (const b of blocks || []) {
    const next = trail.concat(b);
    if (b.id === id) return next;
    const found = branchTrail(b.children, id, next);
    if (found) return found;
  }
  return null;
}
