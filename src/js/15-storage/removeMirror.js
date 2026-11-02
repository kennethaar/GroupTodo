async function removeMirror(rec, paths) {
  if (mirrorMode(rec) === "off") return;
  const m = mirrorFor(rec);
  for (const path of paths) { try { await m.remove(path); } catch (_) {} }
}
