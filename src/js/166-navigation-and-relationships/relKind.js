function relKind(r) {
  return r.block ? "task" : inSpace(r.space, () => statusDirOf(r.path) ? "project" : pageKind(r.path));
}
