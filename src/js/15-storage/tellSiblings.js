function tellSiblings(rec, wrote, gone) {
  const b = rec && rec.backend;
  if (!b || !MERGED_KINDS.has(b.kind) || (!wrote.length && !gone.length)) return;
  const at = Date.now();
  SIBLING_SEEN.set(rec.name, at);
  try { localStorage.setItem(siblingStampKey(rec.name), JSON.stringify({at, by: WINDOW_ID})); } catch (_) {}
  try { if (SIBLINGS) SIBLINGS.postMessage({by: WINDOW_ID, space: rec.name, kind: b.kind, wrote, gone}); } catch (_) {}
}
