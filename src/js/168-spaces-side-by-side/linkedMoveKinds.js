/* The pages these lines link to, split by what moving the lines does to them:
   a page only the lines use goes along ({move}); a page other pages link to
   too stays where it is and is mirrored into the target ({mirror}). Pages the
   target already has, and journal pages, are left out. */
function linkedMoveKinds(items, target) {
  const move = [], mirror = [];
  inSpace(items[0]?.space, () => {
    const blocks = items.map(x => findBlock(x.id)?.block).filter(Boolean);
    const inside = new Set();
    walkBlocks(blocks, b => { inside.add(b); });
    const refs = new Set();
    for (const b of blocks) for (const p of pageReferenceTargets({props: {}, blocks: [b]})) refs.add(p);
    for (const path of refs) {
      if (isJournalPath(path) || !V.pages.has(path) || items.some(x => x.path === path)) continue;
      if (target && LOADED.get(target)?.pages.has(path)) continue;
      const others = backlinksTo(path).filter(h => !inside.has(h.block) && !(h.trail || []).some(b => inside.has(b)));
      (others.length || V.pages.get(path).props?.space_sync_id ? mirror : move).push(path);
    }
  });
  return {move, mirror};
}
