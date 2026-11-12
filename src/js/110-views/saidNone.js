/* Whether a project says it has none of something, written key:: none, the way
   depends_on:: none does: asked once, then left alone (#377). */
function saidNone(r, prop) {
  return inS(r, () => trim(getPage(r.path)?.props?.[prop] || "").toLowerCase() === NOTHING_FIRST);
}
