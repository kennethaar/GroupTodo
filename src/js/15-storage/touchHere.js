/* The edit on this page only. Undo uses this, because it puts back each copy
   separately and carrying one restore to the others would undo them twice. */
function touchHere(path) {
  clearMemo();
  QUIET_CACHE = null;
  const page = V.pages.get(path);
  if (page) {
    const props = page.props || (page.props = {});
    props.updated = nowStamp();
    const me = stampName();
    if (me) props.updated_by = me;
    else delete props.updated_by;
    calNoteGone(path, page);
  }
  V.dirty.add(path);
  scheduleFlush();
  scheduleAutoSync();
  if (path.startsWith(DIRS.lists + "/") && !TEMPLATE_BACKFILL_BUSY) scheduleTemplateRefresh(path);
}
