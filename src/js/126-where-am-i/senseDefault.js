// The first context of a kind you already have, else the usual word for it.
function senseDefault(kind) {
  const have = new Map(contextList().map(c => [c.toLowerCase(), c]));
  const hit = SENSE_DEFAULTS[kind].find(c => have.has(c));
  return hit ? have.get(hit) : SENSE_DEFAULTS[kind][0];
}
