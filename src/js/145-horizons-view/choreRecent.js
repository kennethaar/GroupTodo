/* ---------- log a chore (#239) ----------
   Something done at home with no rhythm: a sick child's bed, an extra run to
   the recycling. What, where, how long, who and when, each picked. What was
   done before is offered, and picking it fills in its room and size. */
function choreRecent() {
  const seen = new Map();
  for (const a of asNeededChores()) seen.set(choreKey(a.title), a);
  for (const d of choresDone()) if (!seen.has(choreKey(d.title))) seen.set(choreKey(d.title), d);
  return [...seen.values()].slice(0, 30).map(r => ({words: choreWords(r.title), ctx: r.ctx, size: estTier(r.title)}));
}
