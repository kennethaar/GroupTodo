/* ---------- tombstones (deletes that survive a merge) ---------- */
function tombstones() {
  const raw = getSetting("deleted") || "";
  const out = new Map();
  for (const part of raw.split(";")) {
    const [p, t] = part.split("@");
    if (p && t) out.set(trim(p), trim(t));
  }
  return out;
}
