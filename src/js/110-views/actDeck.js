function actDeck() {
  const rows = actMineOpen().filter(a => !isChore(a) || choreStale(a))
    .map(a => Object.assign({}, a, {space: a.space || V.space}));
  /* A step set to Doing is dealt too, with steps still open under it (#462):
     you are on it, so it is a very next action like the one under it. */
  const seen = new Set(rows.map(a => a.block));
  for (const a of rows.slice()) for (let p = a.block._parent; p; p = p._parent) {
    if (p.state !== "DOING" || seen.has(p)) continue;
    seen.add(p);
    rows.push(Object.assign({}, a, {block: p, state: p.state, title: p.title,
      due: inS(a, () => effectiveDue(p)), context: inS(a, () => blockContext(p)),
      missingContext: !inS(a, () => blockContext(p)), missingVerb: !startsWithVerb(p.title),
      added: addedDate(p) || a.added, age: blockAge(p) ?? a.age}));
  }
  return rows;
}
