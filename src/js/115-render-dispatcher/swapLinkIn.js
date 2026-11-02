/* Rewriting one link in a line, in the markdown, leaving every other word
   alone. A link can carry [[ref][label]], so the whole bracket goes and what
   replaces it is a plain link to the new target. */
function swapLinkIn(a, from, to) {
  const quoted = String(from).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("\\[\\[" + quoted + "(\\]\\[[^\\]]*)?\\]\\]", "i");
  return inSpace(a.space, () => {
    if (!re.test(a.block.title)) return false;
    a.block.title = trim(a.block.title.replace(re, to ? "[[" + to + "]]" : ""))
      .replace(/\s{2,}/g, " ");
    if (to) createLinkedPages(a.block.title);
    touch(a.path); noteTodoTouched();
    return true;
  });
}
