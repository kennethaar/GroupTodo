/* A part of a graph: the nodes `keep` says yes to, as fresh copies with their
   degree counted again inside the part, and at most `cap` of them.

   Past a couple of hundred dots the picture stops being readable and starts
   being wallpaper, so the best-connected are kept and the rest counted in
   `dropped` rather than drawn as a grey cloud. `centre` is kept whatever its
   degree: a middle that was pruned for being quiet is how "show me this
   project" ends up showing something else. */
function graphPart(full, keep, cap, centre) {
  let idx = full.nodes.map((nd, i) => i).filter(i => !keep || keep(full.nodes[i], i));
  let dropped = 0;
  if (cap && idx.length > cap) {
    idx.sort((a, b) => (full.nodes[b].key === centre) - (full.nodes[a].key === centre)
      || full.nodes[b].deg - full.nodes[a].deg || full.nodes[a].label.localeCompare(full.nodes[b].label));
    dropped = idx.length - cap;
    idx = idx.slice(0, cap);
  }
  const at = new Map(idx.map((old, i) => [old, i]));
  const nodes = idx.map(old => Object.assign({}, full.nodes[old], {deg: 0, hub: false}));
  const edges = [];
  for (const [a, b] of full.edges) {
    if (!at.has(a) || !at.has(b)) continue;
    const e = [at.get(a), at.get(b)];
    edges.push(e);
    nodes[e[0]].deg++; nodes[e[1]].deg++;
  }
  /* Labels: at 200 dots, naming them all is a wall of text with a graph
     somewhere behind it. Name the hubs, and the one under the cursor. */
  nodes.slice().sort((a, b) => b.deg - a.deg).slice(0, 14).forEach(nd => { if (nd.deg > 0) nd.hub = true; });
  return {nodes, edges, dropped};
}
