/* Contexts, likeliest first: the one the other actions starting with the same
   verb have (Call is @phone), the ones of the same project, of lines sharing
   its words, then how much each is used at all. */
function actCtxRank(r) {
  const m = new Map(), add = (c, n) => m.set(c.toLowerCase(), (m.get(c.toLowerCase()) || 0) + n);
  const verb = actVerbOf(r.block.title), mine = titleWords(r.block.title);
  for (const a of leafActions()) {
    if (!a.context || a.block === r.block || (a.space || V.space) !== r.space) continue;
    add(a.context, 1);
    if (verb && actVerbOf(a.title) === verb) add(a.context, 30);
    if (r.projectPath && a.projectPath === r.projectPath) add(a.context, 20);
    add(a.context, [...titleWords(a.title)].filter(w => mine.has(w)).length * 10);
  }
  return m;
}
