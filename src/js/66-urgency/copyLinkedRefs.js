function copyLinkedRefs(path) {
  const hits = linkedRefsToCopy(path);
  if (!hits.length) { notify("Every line that links here is on the page already."); return 0; }
  const page = getPage(path), space = V.space;
  const snapshot = structuredClone(page);
  // A second copy on the same day goes in with the first.
  const heading = "Copied from linked references [[" + todayISO() + "]]";
  const kept = page.blocks.find(b => !b.state && b.title === heading);
  const root = kept || newBlock({title: heading});
  const groups = new Map();
  const groupTitle = p => "[[" + pageRef(p) + "]]";
  for (const h of hits) {
    const id = ensureBlockId(h.path, h.block);
    const copy = cloneBlock(h.block);
    walkBlocks([copy], b => { delete b.props.id; delete b.props.branch_sync_id; });
    copy.props.copied_from = id;
    if (!groups.has(h.path)) {
      let from = root.children.find(b => b.title === groupTitle(h.path));
      if (!from) { from = newBlock({title: groupTitle(h.path)}); root.children.push(from); }
      groups.set(h.path, from);
    }
    groups.get(h.path).children.push(copy);
  }
  if (!kept) page.blocks.push(root);
  touch(path);
  pushUndo({at: Date.now(), run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot)); touch(path); render(); return true;
  }});
  render();
  notify("Copied " + hits.length + " line" + (hits.length === 1 ? "" : "s") + " from " + groups.size +
    " page" + (groups.size === 1 ? "" : "s") + " to the bottom of " + pageTitle(path) + ". The originals stay.");
  return hits.length;
}
