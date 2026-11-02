/* Build the next occurrence beside the one just finished. */
function makeNextOccurrence(path, block, when) {
  const page = getPage(path);
  if (!page) return null;
  const copy = newBlock({
    state: "TODO",
    title: block.title,
    body: (block.body || []).slice(),
    props: {},
  });
  // Carry what describes the job; leave behind what described that one doing of it.
  for (const [k, v] of Object.entries(block.props || {})) {
    if (/^(added|closed|done_by|scheduled|deadline|assigned_at|until|expired|hold)$/i.test(k)) continue;
    copy.props[k] = v;
  }
  // Same time of day as the last one: a weekly meeting is still at ten.
  setBlockProp(copy, "SCHEDULED", whenValue(when, dueWhen(block)?.time));
  stampAuthor(copy);

  const sibs = siblingsOf(page, block);
  const at = sibs.indexOf(block);
  sibs.splice(at < 0 ? sibs.length : at + 1, 0, copy);
  touch(path);
  return copy;
}
