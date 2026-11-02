function jumpToSourceNode(path, block) {
  openPage(path);
  if (!block?.id) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const node = document.querySelector(idSel(".blk", block.id, ".txt"));
    if (node) centerLinkText(node);
  }));
}
