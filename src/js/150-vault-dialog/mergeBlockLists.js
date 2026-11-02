function mergeBlockLists(local, incoming, preferIncoming) {
  const pool = new Map();
  for (const b of incoming) {
    const k = blockSig(b);
    if (!pool.has(k)) pool.set(k, []);
    pool.get(k).push(b);
  }
  const taken = new Set();
  const out = [];
  for (const lb of local) {
    const bucket = pool.get(blockSig(lb));
    const ib = bucket && bucket.length ? bucket.shift() : null;
    if (!ib) { out.push(lb); continue; }
    taken.add(ib);
    const winner = preferIncoming ? ib : lb;
    const loser  = preferIncoming ? lb : ib;
    winner.props = Object.assign({}, loser.props || {}, winner.props || {});
    winner.children = mergeBlockLists(lb.children || [], ib.children || [], preferIncoming);
    out.push(winner);
  }
  for (const ib of incoming) if (!taken.has(ib)) out.push(ib);
  return out;
}
