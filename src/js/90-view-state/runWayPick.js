/* The ways that fit, best first. A limit rules a way out; then the fewest
   ticked needs left unmet wins, and a tie goes to the simpler way. missing:
   the ticked needs that way cannot meet, so the advice can say so. */
function runWayPick(needs = [], limits = []) {
  const ids = Object.keys(RUN_WAYS);
  return ids.filter(id => {
    const w = RUN_WAYS[id];
    return !(w.py && limits.includes("nopy")) && !(w.run && limits.includes("norun")) && !(w.web && limits.includes("noweb"));
  }).map(id => ({id, missing: needs.filter(n => !RUN_WAYS[id].can.includes(n))}))
    .sort((a, b) => a.missing.length - b.missing.length || ids.indexOf(a.id) - ids.indexOf(b.id));
}
