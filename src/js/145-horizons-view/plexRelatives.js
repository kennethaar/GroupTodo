/* Edges are directed: [from, to] means the page `from` has a link in it that
   points at `to`. That is the whole of the hierarchy, and it is already in the
   files. */
function plexRelatives(g, key) {
  const i = g.nodes.findIndex(n => n.key === key);
  const parents = [], children = [], jumps = [];
  if (i < 0) return {i: -1, parents, children, jumps};
  for (const [a, b] of g.edges) {
    if (a === i && !children.includes(b)) children.push(b);
    else if (b === i && !parents.includes(a)) parents.push(a);
  }
  // A sibling is anything that hangs off one of your parents besides you.
  for (const pi of parents)
    for (const [a, b] of g.edges)
      if (a === pi && b !== i && !jumps.includes(b) && !children.includes(b)) jumps.push(b);
  return {i, parents, children, jumps};
}
