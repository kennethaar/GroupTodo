/* One line and everything under it, into another space (its day page there,
   or the same file name) or after a chosen line. */
async function transferBranch(ctx, target, choice, destination = null) {
  const hit = inSpace(ctx.space, () => findBlock(ctx.id));
  if (!hit) throw new Error("That line no longer exists.");
  if (!LOADED.has(target)) await loadSpaceRecord(target);
  const pseudo = {props: {}, blocks: [hit.block]};
  const refs = inSpace(ctx.space, () => [...pageReferenceTargets(pseudo)]);
  const sourceText = serializePage(hit.page);
  const targetPath = destination?.path || inSpace(target, () => isJournalPath(ctx.path)
    ? ensureJournal((/\d{4}-\d{2}-\d{2}/.exec(ctx.path) || [todayISO()])[0])
    : ctx.path);
  if (target === ctx.space && targetPath === ctx.path) throw new Error("Choose another file or another area.");
  const oldTarget = inSpace(target, () => getPage(targetPath));
  const targetText = oldTarget ? serializePage(oldTarget) : null;
  await copyTransferAssets(pseudo, ctx.space, target);
  if (choice.references !== false && target !== ctx.space && refs.length &&
      !await copyPagesToSpace(refs.map(path => ({path, from: ctx.space})), target,
        {exclude: [ctx.path, targetPath], mode: choice.mode, branchReferences: true, inner: true}))
    return false;

  // A meeting from your calendar, synced on from your own area, is chosen for that area from now on.
  const feed = blockProp(hit.block, "cal_feed");
  if (choice.mode === "sync" && feed && ctx.space === calHome() && target !== ctx.space) {
    const also = calAlso(calFeedOf(feed));
    calSetShare(hit.block, [...new Set([...calTargets(hit.block, also), target])], also);
  }
  const moved = cloneBlock(hit.block);
  if (choice.mode === "sync") {
    const id = hit.block.props.branch_sync_id || uid();
    hit.block.props.branch_sync_id = moved.props.branch_sync_id = id;
  } else walkBlocks([moved], b => { delete b.props.branch_sync_id; });
  inSpace(target, () => {
    const page = getPage(targetPath) || putPage(targetPath, {props: {}, blocks: []});
    const anchor = destination?.id ? findBlock(destination.id) : null;
    if (anchor && anchor.path === targetPath) {
      const siblings = siblingsOf(page, anchor.block);
      siblings.splice(siblings.indexOf(anchor.block) + 1, 0, moved);
    } else page.blocks.push(moved);
    touch(targetPath);
  });
  await flush();
  if (LOADED.get(target).dirty.has(targetPath)) {
    notify("The target could not be saved. The original is kept.", "warn");
    return false;
  }
  inSpace(ctx.space, () => {
    if (choice.mode === "move") removeBlockFrom(hit.page, hit.block);
    touch(ctx.path);
  });
  await flush();
  clearMemo();
  render();
  if (choice.inner) return true;
  pushUndo({run: () => {
    inSpace(ctx.space, () => { putPage(ctx.path, parsePage(sourceText)); touchHere(ctx.path); });
    inSpace(target, () => {
      if (targetText === null) removePage(targetPath);
      else { putPage(targetPath, parsePage(targetText)); touchHere(targetPath); }
    });
    flush();
    render();
    return true;
  }});
  notify("Line and children transferred.");
  return true;
}
