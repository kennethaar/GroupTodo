/* The tracker the dialog or a schedule names, already a line among the notes:
   moved up to the top of the day rather than left where the section misses it. */
function liftTrackerLine(page, name) {
  if (Object.keys(page.props || {}).some(k => parseTracker(k + "::")?.name === name)) return false;
  let hit = null;
  walkBlocks(page.blocks, b => { const t = !hit && !b.state && !(b.children || []).length && parseTracker(b.title); if (t && t.name === name) hit = {b, t}; });
  if (!hit) return false;
  removeBlockFrom(page, hit.b);
  page.props = page.props || {};
  page.props[hit.t.key] = hit.t.raw;
  return true;
}
