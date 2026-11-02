/* The ones not kept go, and whatever was under them -- lines, notes -- moves
   under the one kept, so nothing written goes with them. Each page touched is
   kept as it was in snaps, so one undo puts every group back. */
function foldNextTwins(rows, keep, snaps) {
  const remember = (space, path) => {
    const k = JSON.stringify([space, path]);
    if (!snaps.has(k)) snaps.set(k, {space, path, text: inSpace(space, () => serializePage(getPage(path)))});
  };
  const here = inSpace(keep.space, () => findBlock(keep.block.id));
  if (!here) { notify("The one to keep is no longer there.", "warn"); return 0; }
  remember(keep.space, here.path);
  let n = 0;
  for (const r of rows) {
    if (r === keep) continue;
    const hit = inSpace(r.space, () => findBlock(r.block.id));
    if (!hit) continue;
    remember(r.space, hit.path);
    const b = hit.block, k = here.block;
    k.children = [...(k.children || []), ...(b.children || []).map(cloneBlock)];
    for (const l of b.body || []) if (!(k.body || []).includes(l)) (k.body || (k.body = [])).push(l);
    inSpace(r.space, () => { removeBlockFrom(hit.page, b); touch(hit.path); });
    n++;
  }
  if (n) inSpace(keep.space, () => touch(here.path));
  return n;
}
