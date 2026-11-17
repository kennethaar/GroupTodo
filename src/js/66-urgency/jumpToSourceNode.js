function jumpToSourceNode(path, block) {
  openPage(path);
  if (!block?.id) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    // The page opened in the middle; the side panel may show the same line in its references (#425).
    const node = $("#content").querySelector(idSel(".blk", block.id, ".txt"));
    if (node) centerLinkText(node);
  }));
}
