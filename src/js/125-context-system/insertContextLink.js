function insertContextLink(path, block, ctx) {
  if (hasContextLink(block.title)) { notify("Already has a context"); return; }
  block.title = trim(block.title) + " [[c/" + ctx + "]]";
  touch(path);
  render();
}
