function langWalk(root) {
  if (!root) return;
  if (root.nodeType === 3) { if (!langSkipped(root.parentElement)) langText(root); return; }
  if (root.nodeType !== 1 || langSkipped(root)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.nodeType === 1 && n.matches(LANG_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  for (let n = w.currentNode; n; n = w.nextNode()) {
    if (n.nodeType === 3) langText(n);
    else for (const a of LANG_ATTRS) if (n.hasAttribute(a)) langAttr(n, a);
  }
}
