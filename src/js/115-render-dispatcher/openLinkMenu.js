function openLinkMenu(node, ref) {
  const a = blockBehind(node);
  linkMenu(ref, a, a && a.space);
}
