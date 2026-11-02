/* The order a box offers its options in: connection to this project first,
   then how much the area uses it. Keys are lower case, as solChoices looks
   them up. */
function solRank(r, pfx, read) {
  const m = new Map();
  for (const [k, v] of solConnected(r)) if (k.startsWith(pfx)) m.set(k.slice(pfx.length), v * 100);
  for (const [k, v] of solTally(r, read)) { const key = String(k).toLowerCase(); m.set(key, (m.get(key) || 0) + v); }
  return m;
}
