function queryMatch(q, x) {
  switch (q.op) {
    case "and": return q.args.every(a => queryMatch(a, x));
    case "or": return q.args.some(a => queryMatch(a, x));
    case "not": return !q.args.some(a => queryMatch(a, x));
    case "true": return true;
    case "task": return !!x.block && (q.states.length ? q.states.includes(x.block.state) : !!x.block.state);
    case "text": return x.text().includes(String(q.s || "").toLowerCase());
    case "link": {
      const L = queryLinkSet(q.ref);
      return x.path === L.key || x.links(L);
    }
    case "page": return pageNamed(x.path, q.ref);
    case "prop": return !!x.block && queryValueMatch(blockProp(x.block, q.key), q.value);
    case "pageprop": return queryValueMatch(pagePropOf(x.path, q.key), q.value);
    case "between": {
      const day = x.day();
      const from = queryDay(q.from), to = queryDay(q.to);
      if (!day || !from || !to) return false;
      return day >= (from < to ? from : to) && day <= (from < to ? to : from);
    }
    default: return false;
  }
}
