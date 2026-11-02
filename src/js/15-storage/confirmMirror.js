/* The backend took these, so a "pending" mirror has no further use for them. A
   "full" mirror keeps the page but stops calling it unconfirmed. */
async function confirmMirror(rec, paths) {
  const mode = mirrorMode(rec);
  if (mode === "off") return;
  if (mode === "pending") {
    const m = mirrorFor(rec);
    for (const path of paths) { try { await m.remove(path); } catch (_) {} }
    return;
  }
  const open = await unconfirmed(rec);
  let changed = false;
  for (const path of paths) if (open.delete(path)) changed = true;
  if (changed) await setUnconfirmed(rec, open);
}
