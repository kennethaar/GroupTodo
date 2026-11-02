function relState(r) {
  return r.block ? r.block.state : inSpace(r.space, () => statusDirOf(r.path) || pageKind(r.path));
}
