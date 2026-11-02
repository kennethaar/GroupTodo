/* Who links to a page and who it links to, from every link there is. */
function mapRelations(key) {
  const full = graphFull();
  const i = full.nodes.findIndex(nd => nd.key === key);
  const out = [], inn = [];
  for (const [a, b] of full.edges) {
    if (a === i) out.push(full.nodes[b]);
    else if (b === i) inn.push(full.nodes[a]);
  }
  const byDeg = (x, y) => y.deg - x.deg || x.label.localeCompare(y.label);
  return {node: full.nodes[i] || null, out: out.sort(byDeg), inn: inn.sort(byDeg)};
}
