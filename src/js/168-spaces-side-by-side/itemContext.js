/* The line, page or card an event happened on, in the space it belongs to. */
function itemContext(target) {
  const b = target?.closest?.(".blk");
  const host = target?.closest?.("[data-space][data-path]");
  const space = host?.dataset.space || V.space;
  if (b) {
    const hit = inSpace(space, () => findBlock(b.dataset.id));
    if (hit) return {space, path: hit.path, id: hit.block.id};
  }
  return host ? {space, path: host.dataset.path, id: host.dataset.blockId || null} : SPACE_CONTEXT;
}
