function syncSummary(r) {
  const bits = [];
  if (r.added)     bits.push(r.added + " new");
  if (r.updated)   bits.push(r.updated + " updated");
  if (r.merged)    bits.push(r.merged + " merged");
  if (r.deleted)   bits.push(r.deleted + " removed");
  if (r.conflicts) bits.push(r.conflicts + " conflict copies kept");
  if (!bits.length) return "Already up to date.";
  return "Synced: " + bits.join(", ") + ".";
}
