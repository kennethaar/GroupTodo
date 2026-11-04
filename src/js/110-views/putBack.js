/* Back where it was: after its line, under its parent, at the end of its
   line, or else at the end of its page. A chapter goes back at its place.
   Works on any page with putback:: (the darlings page has it). */
function putBack(path, block) {
  const page = getPage(path);
  if (!page || !page.blocks.includes(block)) return;
  const p = k => trim(blockProp(block, k) || "");
  page.blocks.splice(page.blocks.indexOf(block), 1);
  touch(path);
  const strip = () => { for (const k of Object.keys(block.props)) if (PUTBACK_PROPS.includes(k.toLowerCase())) delete block.props[k]; };
  if (p("chapter")) {
    const name = trim((/\[\[([^\]]+)\]\]/.exec(block.title) || [, block.title])[1]);
    const book = bookPage(), at = Math.min(+p("chapter") - 1, bookChapters().length);
    const line = newBlock({title: "[[" + name + "]]"}, false), chapters = bookChapters();
    if (at < chapters.length) book.blocks.splice(book.blocks.indexOf(chapters[at].block), 0, line); else book.blocks.push(line);
    saveBook();
    return;
  }
  const from = findExistingPage(namesIn(p("from"))[0] || "");
  const home = from && getPage(from);
  if (!home) { strip(); page.blocks.unshift(block); touch(path); notify("Its page is gone, so it stays here.", "warn"); render(); return; }
  const into = blockWithId(from, p("in")), after = blockWithId(from, p("after")), under = blockWithId(from, p("under"));
  const lines = +p("lines") ? block.children.splice(-p("lines")) : [];
  strip();
  const back = [block, ...lines];
  if (into) into.title = trim(into.title + " " + block.title);
  else if (after) { const sibs = siblingsOf(home, after); sibs.splice(sibs.indexOf(after) + 1, 0, ...back); }
  else if (under) (under.children || (under.children = [])).unshift(...back);
  else home.blocks.push(...back);
  touch(from);
  render();
}
