/* Pages another window saved, read in. One with unsaved work here is left:
   it goes up merged with theirs. The page being typed in is left too, and
   is merged when the line is written back. Paths null means every page. */
async function takeSiblingSaves(rec, wrote, gone = []) {
  const b = rec && rec.backend;
  if (!b || !b.readText || !MERGED_KINDS.has(b.kind) || rec.hold || WIPING) return 0;
  const typing = typingPath(rec.name);
  const mine = p => rec.dirty.has(p) || rec.removed.has(p) || p === typing || stillLoading(rec, p);
  let got;
  if (wrote) {
    got = new Map();
    for (const p of wrote) {
      if (mine(p)) continue;
      const t = await b.readText(p);
      if (t != null) got.set(p, t); else gone = gone.concat(p);
    }
  } else {
    if (!b.names || !b.readMany) return 0;
    const names = (await b.names()).filter(p => /\.md$/i.test(p) && !isGuidePath(p) && !isLangPath(p) &&
                                                !isPromptPath(p) && !isNpmDraftPath(p) && !syncCopyOf(p));
    got = await b.readMany(names.filter(p => !mine(p)));
    const there = new Set(names);
    gone = [...(rec.base || new Map()).keys()].filter(p => !there.has(p) && rec.pages.has(p));
  }
  let changed = 0;
  for (const [p, t] of got) {
    if (mine(p) || looksLikeBundle(t)) continue;
    const had = rec.pages.get(p);
    if (had && (rec.base?.get(p) === t || PAGE_SRC.get(had) === t)) continue;
    const page = parsePage(t);
    PAGE_SRC.set(page, t);
    rec.pages.set(p, page);
    noteBase(rec, p, t);
    changed++;
  }
  for (const p of gone) {
    if (mine(p) || !rec.pages.has(p)) continue;
    rec.pages.delete(p); rec.base?.delete(p);
    changed++;
  }
  if (changed && rec.name === V.space) {
    try { scanVerbs(); } catch (_) {}
    renderUnlessTyping();
  }
  return changed;
}
