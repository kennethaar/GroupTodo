/* Push this project's dependents clear of it, and theirs clear of them. Each
   pass can only move a project later, so the walk terminates; the cap is there
   for a chain somebody has managed to make longer than any real plan. */
function cascadePush(path) {
  const moved = [];
  const queue = [path];
  const seen = new Set();
  for (let guard = 0; queue.length && guard < 200; guard++) {
    const from = queue.shift();
    for (const d of dependentsOf(from)) {
      const t = chainTrouble(d);
      if (!t) continue;
      if (pushProjectTo(d, t.need)) {
        if (!seen.has(d)) { seen.add(d); moved.push(d); }
        queue.push(d);
      }
    }
  }
  return moved;
}
