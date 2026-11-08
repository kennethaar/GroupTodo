/* [[core, count]] for the feelings in a Reflect log, most first (#214). */
function weekFeelings(log) {
  const n = new Map();
  const walk = bs => (bs || []).forEach(b => { const c = feelingCore(b.title); if (c) n.set(c, (n.get(c) || 0) + 1); walk(b.children); });
  for (const d of log) walk(d.items);
  return [...n].sort((a, b) => b[1] - a[1]);
}
