/* A date somebody set, not one the bar borrowed from Added:: or the journal day. */
const isPlanned = b => !!(dateIn(blockProp(b, "SCHEDULED")) || dateIn(blockProp(b, "DEADLINE")));

/* ---------- moving a bar ----------
   Only an open task can be dragged. A done task's end is the day somebody
   ticked it off, and dragging that would be editing the past. */
const canMoveTask = b => !!OPEN_STATES[b.state];

const dropProp = (b, key) => {
  const k = Object.keys(b.props || {}).find(x => x.toLowerCase() === key.toLowerCase());
  if (k) delete b.props[k];
};
const writeDay = (b, key, iso) => setBlockProp(b, key, whenValue(iso, timeIn(String(blockProp(b, key) || "").replace(/\[\[[^\]]*\]\]/g, " "))));
