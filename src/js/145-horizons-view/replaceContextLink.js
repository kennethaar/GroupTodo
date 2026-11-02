/* The context lives in the title as [[c/name]], so changing it rewrites that
   link rather than adding a second one, and taking it off leaves the words. */
function replaceContextLink(path, block, ctx) {
  if (!hasContextLink(block.title)) { insertContextLink(path, block, ctx); return; }
  block.title = trim(block.title.replace(/\[\[c\/[^\]]+\]\]/, "[[c/" + ctx + "]]"));
  touch(path); render();
  notify("Now @" + ctx + ".");
}
