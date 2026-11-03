function openScene(s) {
  openPage(s.path);
  if (s.block) focusBlock(s.block.id);
}
