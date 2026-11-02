/* The due date of a task is its scheduled day unless it only has a deadline,
   which is the one the chips already read. */
function setDue(block, iso, time = null) {
  const props = block.props || (block.props = {});
  if (!iso) { for (const k of Object.keys(props)) if (/^(scheduled|deadline|due)$/i.test(k)) delete props[k]; return; }
  const key = blockProp(block, "DEADLINE") && !blockProp(block, "SCHEDULED") ? "DEADLINE" : "SCHEDULED";
  setBlockProp(block, key, whenValue(iso, time));
}
