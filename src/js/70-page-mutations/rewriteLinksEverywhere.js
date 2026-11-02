function rewriteLinksEverywhere(oldRef, newRef) {
  if (oldRef === newRef) return 0;
  let count = 0;
  for (const [path, page] of V.pages) {
    let changed = false;
    const update = (obj, key) => {
      const after = rewriteNamedReference(obj[key], oldRef, newRef);
      if (after !== obj[key]) { obj[key] = after; changed = true; }
    };
    for (const k of Object.keys(page.props || {})) update(page.props, k);
    walkBlocks(page.blocks, b => {
      update(b, "title");
      for (const k of Object.keys(b.props || {})) update(b.props, k);
      for (let i = 0; i < (b.body || []).length; i++) update(b.body, i);
    });
    if (changed) { touch(path); count++; }
  }
  return count;
}
