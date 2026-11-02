function removeContextLink(path, block) {
  block.title = trim(block.title.replace(/\[\[c\/[^\]]+\]\]/, "").replace(/\s{2,}/g, " "));
  touch(path); render();
  notify("Context taken off.");
}
