/* The date an open step answers to: its own, else the nearest line above it
   that has one. Read, never written, so moving the parent's date moves every
   undated step under it. A closed line above has no deadline left to give.
   Needs _parent, which flattenBlocks sets. */
function effectiveDue(b) {
  const own = dueDate(b);
  if (own || !OPEN_STATES[b.state]) return own;
  for (let p = b._parent; p; p = p._parent) {
    if (p.state && !OPEN_STATES[p.state]) continue;
    const d = dueDate(p);
    if (d) return d;
  }
  return null;
}
