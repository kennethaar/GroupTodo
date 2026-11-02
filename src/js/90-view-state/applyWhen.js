/* Write what parseWhen found onto a block, and say what it was in a few words.
   Returns the property keys written so a "keep the words" can take them off. */
function applyWhen(block, w) {
  const keys = [];
  const put = (k, v) => { setBlockProp(block, k, v); keys.push(k); };
  const timed = w.DEADLINE && !w.SCHEDULED ? "DEADLINE" : "SCHEDULED";
  if (w.SCHEDULED) put("SCHEDULED", whenValue(w.SCHEDULED, timed === "SCHEDULED" ? w.time : null));
  if (w.DEADLINE)  put("DEADLINE",  whenValue(w.DEADLINE,  timed === "DEADLINE" ? w.time : null));
  if (w.until)     put("until",     "[[" + w.until + "]]");
  if (w.repeat)    put(REPEAT_PROP, w.repeat);
  if (w.remind)    put("remind",    w.remind);
  if (w.priority)  put("priority",  w.priority);
  if (w.hold)      put("hold",      w.hold === HOLD_OPEN ? HOLD_OPEN : "[[" + w.hold + "]]");
  block.title = w.title;
  return keys;
}
