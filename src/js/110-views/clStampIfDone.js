/* A day with no line left to answer is stamped clarified::. Today never is:
   it is still being written, and Clarify only takes what Catch up put there (#516). */
function clStampIfDone(path) {
  const page = getPage(path), dealt = clDealt();
  if (!page || trim(page.props.clarified || "") || baseName(path) >= todayISO()) return;
  let left = false;
  walkBlocks(page.blocks, b => { if (!left && dayCandidate(b) && !dealt.has(clKey(path, b))) left = true; });
  if (!left) { page.props.clarified = todayStamp(); touch(path); }
}
