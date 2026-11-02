/* How a project's time is shared among its clients, in percent: client_split::
   on the project when it says so, else the clients' own share::, else evenly. */
function clientShares(r) {
  const clients = projectClients(r);
  if (!clients.length) return [];
  const own = parseSplit(pageProp(r.space, r.path, "client_split"))
    .map(x => ({name: clients.find(c => c.toLowerCase() === x.name.toLowerCase()) || x.name, pct: x.pct}));
  const shares = own.length ? own
    : inSpace(r.space, () => clients.every(c => orgShare(c) > 0)) ? clients.map(c => ({name: c, pct: inSpace(r.space, () => orgShare(c))}))
    : clients.map(c => ({name: c, pct: 1}));
  const sum = shares.reduce((n, x) => n + x.pct, 0) || 1;
  return shares.map(x => ({name: x.name, pct: x.pct * 100 / sum}));
}
