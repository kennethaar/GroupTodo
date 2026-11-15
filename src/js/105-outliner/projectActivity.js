/* How busy each project has been this week (#401): its tasks on the last 7
   day pages, filed under it or linking it, and what was ticked done in it. */
function projectActivity() {
  const all = ["1", "3", "2"].flatMap(c => projectsIn(c));
  const n = new Map(all.map(p => [p, 0]));
  const since = shiftISO(todayISO(), -7);
  for (const [jp, page] of V.pages) {
    if (!isJournalPath(jp)) continue;
    const day = dateIn(baseName(jp));
    if (!day || day < since) continue;
    for (const b of flattenBlocks(page.blocks)) {
      if (!b.state) continue;
      const link = nearestProjectAncestor(b);
      const p = link && findExistingPage(link.ref);
      if (n.has(p)) n.set(p, n.get(p) + 1);
    }
  }
  for (const e of doneHistory())
    if (e.space === V.space && (e.day || "") >= since && n.has(e.path)) n.set(e.path, n.get(e.path) + 1);
  return n;
}
