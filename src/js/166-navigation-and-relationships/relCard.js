function relCard(r) {
  const kind = relKind(r);
  const card = r.block ? boardCard(r)
    : kind === "project" ? boardProjectCard(r, memo("stuckSet", () => new Set(stuckActiveProjects().map(x => x.path))))
    : boardDirCard(r);
  return relTagCard(card, r);
}
