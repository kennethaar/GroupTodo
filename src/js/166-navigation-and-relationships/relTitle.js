function relTitle(r) {
  return inSpace(r.space, () => r.block ? linkWords(r.block.title) || r.block.title : pageTitle(r.path));
}
