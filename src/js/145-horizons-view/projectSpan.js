/* ---------- a project's own span, and moving all of it ---------- */
function projectSpan(path) {
  const page = getPage(path);
  if (!page) return null;
  let start = null, end = null;
  walkBlocks(page.blocks, b => {
    if (!b.state || isMessage(b)) return;
    const s = spanOf(b, null);
    if (!s) return;
    if (!start || s.start < start) start = s.start;
    if (!end   || s.end   > end)   end   = s.end;
  });
  return start ? {start, end} : null;
}
