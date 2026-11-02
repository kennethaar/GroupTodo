/* The line a pill was rendered from, wherever on screen it is. */
function blockBehind(node) {
  const host = node.closest("[data-id]");
  if (!host) return null;
  const id = host.dataset.id;
  for (const a of leafActions()) if (a.block.id === id) return a;
  let found = null;
  for (const name of (visibleSpaces().filter(n => LOADED.has(n)).length
                        ? visibleSpaces().filter(n => LOADED.has(n)) : [null])) {
    inSpace(name, () => {
      for (const [path, page] of V.pages) {
        walkBlocks(page.blocks, b => {
          if (b.id === id && !found) found = {path, block: b, space: name, title: b.title};
        });
        if (found) return;
      }
    });
    if (found) break;
  }
  return found;
}
