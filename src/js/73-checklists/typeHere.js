/* The type as a page in this area. One from another area is copied here
   first, so the task's stage:: link resolves where the task lives. */
function typeHere(t) {
  if (!t.space || t.space === V.space) return t.path;
  const lines = inSpace(t.space, () => (getPage(t.path)?.blocks || []).filter(b => trim(b.title)).map(b =>
    b.state && !/\([^)]+\)\s*$/.test(b.title) ? trim(b.title) + " (" + CORE_WORD[b.state] + ")" : trim(b.title)));
  return createStateList(baseName(t.path), lines);
}
