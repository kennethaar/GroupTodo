/* A day page merged from two copies of it keeps the deletes of both, and a
   meeting either deleted stays out: the merge alone brought it back from the
   copy that still had it, and being back took it off the line for good. */
function calMergeDeleted(merged, a, b) {
  const skip = new Set([...calSkips(a), ...calSkips(b)]);
  if (!skip.size) return merged;
  merged.props.cal_deleted = [...skip].join(" ");
  const out = [];
  walkBlocks(merged.blocks, x => {
    const k = blockProp(x, "cal_uid");
    if (k && (skip.has(k) || skip.has(calLook(x.title, blockProp(x, "time"))))) { out.push(x); return false; }
  });
  out.forEach(x => removeBlockFrom(merged, x));
  return merged;
}
