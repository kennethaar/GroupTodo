/* What the key is about: the line being edited, or the mindmap's current dot. */
function convertTarget(e) {
  const host = e.target.closest(".blk .txt");
  if (host) {
    const hit = findBlock(host.closest(".blk").dataset.id);
    return hit ? {r: {...hit, space: V.space}, host} : null;
  }
  if (state.view !== "pages" || subNow() !== "mindmap") return null;
  const nd = plexGraph().nodes.find(n => n.key === (PLEX.cursor || state.graphFocus));
  if (!nd) return null;
  if (!nd.task) return {r: {path: nd.path, space: nd.space}};
  const hit = inSpace(nd.space, () => findBlock(nd.blockId));
  return hit ? {r: {...hit, space: nd.space}} : null;
}
