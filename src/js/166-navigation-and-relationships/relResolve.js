function relResolve(ref, space) {
  return inSpace(space, () => {
    const target = trim(String(ref).split("][")[0].split("|")[0]);
    const [page, blockId] = target.split("#^");
    const path = findExistingPage(page);
    if (!path) return null;
    if (!blockId) return {path, space: V.space};
    const block = flattenBlocks(getPage(path).blocks).find(b => b.id === blockId);
    return block ? {path, space: V.space, block} : null;
  });
}
