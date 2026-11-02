async function ensureVisibleLoaded() {
  let more = false;
  for (const n of visibleSpaces()) {
    if (!LOADED.has(n)) { try { await loadSpaceRecord(n); more = true; } catch (_) {} }
  }
  if (more) scanVerbs();
}
