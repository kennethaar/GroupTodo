/* What putBack needs to know: the page, the day, the line before it or its parent. */
function rememberPlace(path, block) {
  const page = getPage(path), sibs = siblingsOf(page, block), at = sibs.indexOf(block);
  const prev = at > 0 ? sibs[at - 1] : null, parent = at === 0 && sibs !== page.blocks ? parentOf(page, block) : null;
  return {from: "[[" + pageRef(path) + "]]", cut: todayISO(),
    after: prev ? ensureBlockId(path, prev) : "", under: parent ? ensureBlockId(path, parent) : ""};
}
