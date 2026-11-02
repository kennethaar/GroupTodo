/* A day with no line left to answer is stamped clarified::. */
function clStampIfDone(path) {
  const page = getPage(path), dealt = clDealt();
  if (!page || trim(page.props.clarified || "")) return;
  let left = false;
  walkBlocks(page.blocks, b => { if (!left && dayCandidate(b) && !dealt.has(clKey(path, b))) left = true; });
  if (!left) { page.props.clarified = todayStamp(); touch(path); }
}
