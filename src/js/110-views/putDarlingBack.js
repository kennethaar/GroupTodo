/* Back where it was: after its line, under its parent, at the end of its
   line, or else at the end of its chapter. A chapter goes back at its place. */
function putDarlingBack(block) {
  const page = getPage(DARLINGS_PATH);
  if (!page || !page.blocks.includes(block)) return;
  const p = k => trim(blockProp(block, k) || "");
  page.blocks.splice(page.blocks.indexOf(block), 1);
  touch(DARLINGS_PATH);
  const strip = () => { for (const k of Object.keys(block.props)) if (DARLING_PROPS.includes(k.toLowerCase())) delete block.props[k]; };
  if (p("chapter")) {
    const name = trim((/\[\[([^\]]+)\]\]/.exec(block.title) || [, block.title])[1]);
    const book = bookPage(), at = Math.min(+p("chapter") - 1, bookChapters().length);
    const line = newBlock({title: "[[" + name + "]]"}, false), chapters = bookChapters();
    if (at < chapters.length) book.blocks.splice(book.blocks.indexOf(chapters[at].block), 0, line); else book.blocks.push(line);
    saveBook();
    return;
  }
  const path = findExistingPage(namesIn(p("from"))[0] || "");
  const chapter = path && getPage(path);
  if (!chapter) { strip(); darlingsPage().blocks.unshift(block); notify("Its chapter is gone, so it stays a darling.", "warn"); render(); return; }
  const into = blockWithId(path, p("in")), after = blockWithId(path, p("after")), under = blockWithId(path, p("under"));
  const lines = +p("lines") ? block.children.splice(-p("lines")) : [];
  strip();
  const back = [block, ...lines];
  if (into) into.title = trim(into.title + " " + block.title);
  else if (after) { const sibs = siblingsOf(chapter, after); sibs.splice(sibs.indexOf(after) + 1, 0, ...back); }
  else if (under) (under.children || (under.children = [])).unshift(...back);
  else chapter.blocks.push(...back);
  touch(path);
  render();
}
