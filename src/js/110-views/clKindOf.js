/* What a link on a line is, in Clarify's words (#379): the page it reaches
   says it best, then the link's own prefix. A plain [[link]] is a page. */
function clKindOf(ref, page) {
  if (page) {
    const k = pageKind(page);
    if (["person", "org", "context", "project", "area"].includes(k)) return k;
    if (k === "zettel") return "note";
    return "page";
  }
  return linkKindOf(ref) || "page";
}
