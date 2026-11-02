/* A page and its conflict copy as one page. The one edited last leads: its
   fields win and its lines keep their order, the other's go in among them. */
function mergeSyncCopy(path, ours, theirs) {
  const newer = (theirs.props?.updated || "") > (ours.props?.updated || "");
  const [first, second] = newer ? [theirs, ours] : [ours, theirs];
  const meant = repeatedKeys(second.blocks, repeatedKeys(first.blocks));
  let page = {props: Object.assign({}, second.props || {}, first.props || {}),
              blocks: dedupeBlocks(unionBlocks(first.blocks || [], second.blocks || []), meant)};
  if (isJournalPath(path)) page = calMergeDeleted(page, ours, theirs);
  calRemember(page, calKeysOn(page));
  return page;
}
