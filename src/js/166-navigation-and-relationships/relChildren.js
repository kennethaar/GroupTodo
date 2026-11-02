/* Children are what children:: names, plus the task's own sub-tasks -- or, for
   a project page, the top-level tasks that belong to it, by link or by living
   in its file. */
function relChildren(r, rows) {
  if (!r.block && isContextPath(r.path)) return contextKids(r);
  const children = new Map();
  const add = x => { if (x && relId(x) !== relId(r)) children.set(relId(x), x); };
  inSpace(r.space, () => {
    for (const ref of linksIn(relProps(r).children || relProps(r).parent_of || "")) add(relResolve(ref, r.space));
    if (r.block) {
      for (const b of r.block.children || [])
        if (b.state) add(rows.find(x => x.block === b && x.space === r.space));
      return;
    }
    for (const x of rows) {
      if (!x.block || x.space !== r.space) continue;
      const par = parentOf(getPage(x.path), x.block);
      if (par && par.state) continue;
      const linked = linksIn(x.block.title).map(t => relResolve(t, r.space))
        .find(p => p && !p.block && statusDirOf(p.path));
      if (linked ? linked.path === r.path : x.path === r.path) add(x);
    }
  });
  return [...children.values()];
}
