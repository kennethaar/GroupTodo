function npmForget(space, path) {
  clearTimeout(NPM_WRITE_T);
  safeLS.del("gtd.pref." + npmKey(space, path));
  if (PREF._mem) delete PREF._mem[npmKey(space, path)];
  const rec = LOADED.get(space || V.space), p = npmDraftPath(path);
  if (rec && rec.drafts && rec.drafts.delete(p) && rec.backend && rec.backend.writable && !rec.hold)
    rec.backend.remove(p).catch(e => console.warn("natural planning draft not removed", e));
}
