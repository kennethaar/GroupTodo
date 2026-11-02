function relWouldCycle(parent, child) {
  const rows = relAll(), seen = new Set(), todo = [child];
  while (todo.length) {
    const r = todo.pop(), id = relId(r);
    if (id === relId(parent)) return true;
    if (seen.has(id)) continue;
    seen.add(id);
    todo.push(...relChildren(r, rows));
  }
  return false;
}
