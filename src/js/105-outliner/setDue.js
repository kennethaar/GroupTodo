/* A new date is a deadline. A task that only has a scheduled day keeps
   that kind, since that is the one the chips already read. */
function setDue(block, iso, time = null) {
  const props = block.props || (block.props = {});
  if (!iso) { for (const k of Object.keys(props)) if (/^(scheduled|deadline|due)$/i.test(k)) delete props[k]; return; }
  const key = blockProp(block, "SCHEDULED") && !blockProp(block, "DEADLINE") ? "SCHEDULED" : "DEADLINE";
  setBlockProp(block, key, whenValue(iso, time));
}
