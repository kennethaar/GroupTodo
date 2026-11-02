async function npmFileWrite(d) {
  const rec = LOADED.get(d.space || V.space);
  if (!rec || !rec.backend || !rec.backend.writable || rec.hold) return;
  const p = npmDraftPath(d.path), text = npmDraftText(d);
  try { await rec.backend.write(p, text); (rec.drafts || (rec.drafts = new Map())).set(p, text); }
  catch (e) { console.warn("natural planning draft not saved", e); }
}
