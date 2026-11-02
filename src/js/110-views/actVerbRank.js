/* Verbs, likeliest first: one already in the line (somewhere after the start),
   then the verbs your open actions start with most, those of the same project
   counting three times. */
function actVerbRank(r) {
  const m = new Map(), add = (k, n) => m.set(k, (m.get(k) || 0) + n);
  for (const a of leafActions()) {
    if ((a.space || V.space) !== r.space || a.block === r.block) continue;
    const v = actVerbOf(a.title);
    if (v) add(v, r.projectPath && a.projectPath === r.projectPath ? 3 : 1);
  }
  for (const w of plainTitle(r.block.title).toLowerCase().split(/[^\p{L}\p{M}\-]+/u)) if (VERB_LOOKUP[w]) add(VERB_LOOKUP[w], 1e6);
  return m;
}
