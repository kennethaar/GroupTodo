/* Topics: pages that link mostly among themselves. Louvain: every page moves
   to the neighbouring group that raises the modularity most -- links inside
   groups beyond what chance would give -- then the groups are folded into
   single nodes and it is done again, until nothing moves. A hub that links
   everything counts as linked to everything, so it does not glue the topics
   into one. */
function graphTopics(g) {
  const n = g.nodes.length;
  // Weighted adjacency between the current level's nodes, as maps.
  let adj = Array.from({length: n}, () => new Map());
  for (const [a, b] of g.edges) {
    if (a === b) continue;
    adj[a].set(b, (adj[a].get(b) || 0) + 1);
    adj[b].set(a, (adj[a].get(b) || 0));
  }
  let member = g.nodes.map((_, i) => i);       // page -> node at this level
  for (let level = 0; level < 5; level++) {
    const N = adj.length;
    const k = adj.map(m => { let t = 0; for (const w of m.values()) t += w; return t; });
    const m2 = k.reduce((s, v) => s + v, 0);
    if (!m2) break;
    const comm = adj.map((_, i) => i), tot = k.slice();
    const order = comm.slice().sort((a, b) => k[b] - k[a] || a - b);
    let movedAny = false;
    for (let round = 0; round < 20; round++) {
      let moved = 0;
      for (const i of order) {
        if (!k[i]) continue;
        const links = new Map();
        for (const [j, w] of adj[i]) if (j !== i) links.set(comm[j], (links.get(comm[j]) || 0) + w);
        const own = comm[i];
        tot[own] -= k[i];
        let best = own, gain = (links.get(own) || 0) - tot[own] * k[i] / m2;
        for (const [c, w] of links) {
          const gn = w - tot[c] * k[i] / m2;
          if (gn > gain + 1e-12) { gain = gn; best = c; }
        }
        tot[best] += k[i];
        if (best !== own) { comm[i] = best; moved++; }
      }
      if (!moved) break;
      movedAny = true;
    }
    if (!movedAny) break;
    // Fold every group into one node and go again.
    const ids = new Map();
    for (const c of comm) if (!ids.has(c)) ids.set(c, ids.size);
    const next = Array.from({length: ids.size}, () => new Map());
    for (let i = 0; i < N; i++) for (const [j, w] of adj[i]) {
      const a = ids.get(comm[i]), b = ids.get(comm[j]);
      next[a].set(b, (next[a].get(b) || 0) + w);   // inside a group stays as a loop
    }
    member = member.map(v => ids.get(comm[v]));
    adj = next;
  }
  return member;
}
