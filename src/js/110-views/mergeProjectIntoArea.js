function mergeProjectIntoArea(path, dest) {
  const page = getPage(path), area = getPage(dest);
  if (!page || !area) return;
  const title = pageTitle(path);
  if ((page.blocks || []).length) {
    const b = newBlock({title});
    b.children = page.blocks.map(cloneBlock);
    area.blocks.push(b);
    touch(dest);
  }
  const to = pageRef(dest);
  let n = 0;
  for (const old of spellingsOf(path)) n += rewriteLinksEverywhere(old, to);
  deletePageWithUndo(path);
  clearMemo();
  openPage(dest);
  notify("“" + title + "” is merged into " + pageTitle(dest) +
    (n ? "; links on " + n + (n === 1 ? " page" : " pages") + " point there now" : "") + ". Ctrl-Z brings the project back.");
}
