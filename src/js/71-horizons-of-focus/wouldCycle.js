/* A -> B -> A would make "when can this start" unanswerable, and the honest
   place to refuse it is the moment somebody draws the second arrow. */
function wouldCycle(path, candidate) {
  if (candidate === path) return true;
  const seen = new Set();
  const walk = p => {
    if (p === path) return true;
    if (seen.has(p)) return false;
    seen.add(p);
    return dependsOn(p).some(walk);
  };
  return walk(candidate);
}
