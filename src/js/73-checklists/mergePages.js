function mergePages(sourcePath, targetPath) {
  const src = getPage(sourcePath), tgt = getPage(targetPath);
  if (!src || !tgt) return;
  trackSave("Merging " + pageTitle(sourcePath) + " into " + pageTitle(targetPath), sourcePath);
  tgt.blocks.push(...src.blocks);
  touch(targetPath);
  removePage(sourcePath);
  notify("Merged " + baseName(sourcePath) + " into " + baseName(targetPath));
}
