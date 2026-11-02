function dedupSiblings(list, apply) {
  let n = 0;
  const groups = [];
  for (const b of list) {
    const key = dedupKey(b);
    const blank = !trim(b.title) || /^-{3,}$/.test(trim(b.title)) || isMessage(b);
    // Against every copy already in the group: the first may have no id:: while two others have different ones.
    const g = !blank && groups.find(x => !x.blank && x.key === key && ![x.first, ...x.rest].some(m => dedupClash(m, b)));
    if (g) { g.rest.push(b); n++; } else groups.push({first: b, key, blank, rest: []});
  }
  for (const g of groups) {
    const kids = [...(g.first.children || []), ...g.rest.flatMap(b => b.children || [])];
    if (apply && g.rest.length) {
      const first = g.first;
      first.children = kids;
      for (const b of g.rest) {
        for (const l of b.body || []) if (!(first.body || []).includes(l)) (first.body || (first.body = [])).push(l);
        for (const [pk, pv] of Object.entries(b.props || {}))
          if (!trim(blockProp(first, pk) || "") && trim(pv)) setBlockProp(first, pk, pv);
        if (!b.collapsed) first.collapsed = false;
      }
    }
    // Counting walks the merged children without making them, so it changes nothing.
    n += dedupSiblings(apply ? (g.first.children || []) : kids, apply);
  }
  if (apply) list.splice(0, list.length, ...groups.map(g => g.first));
  return n;
}
