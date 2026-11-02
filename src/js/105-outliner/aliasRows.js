/* The names whose alias starts with what was typed, each offered as that
   alias: "@js" is John Smith written as JS. An alias typed in full comes
   first, and the full name is still offered under it for when you want it.
   A context is written by its own name, [[c/Computer]] for @pc: the line
   reads its context from that link, and a label would hide it. */
function aliasRows(pool, q) {
  if (!q) return [];
  const hits = [];
  for (const n of pool) {
    const a = (n.aliases || []).find(x => x.toLowerCase().startsWith(q));
    if (a) hits.push(Object.assign({accept: "link"}, n, {label: n.kind === "context" ? undefined : a,
      detail: "as " + a, exact: a.toLowerCase() === q}));
  }
  return hits.sort((x, y) => y.exact - x.exact);
}
