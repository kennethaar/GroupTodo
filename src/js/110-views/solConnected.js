function solConnected(r) {
  return memo("solconn:" + solKey(r), () => inS(r, () => {
    const m = new Map();
    const add = (ref, n) => { if (SOL_REF_RE.test(ref)) m.set(ref, (m.get(ref) || 0) + n); };
    const blockText = b => [b.title, ...(b.body || []), ...Object.values(b.props || {})].join("\n");
    const page = getPage(r.path);
    if (!page) return m;
    for (const l of linksIn(Object.values(page.props || {}).join(" "))) add(solRef(l), 5);
    walkBlocks(page.blocks, b => {
      for (const l of linksIn(blockText(b))) add(solRef(l), 5);
      const who = assigneeOf(b, page);
      if (who) add("p/" + slugPerson(who).toLowerCase(), 5);
    });
    for (const hit of backlinksTo(r.path)) {
      const kind = pageKind(hit.path);
      if (kind === "person") add("p/" + baseName(hit.path).toLowerCase(), 4);
      else if (kind === "org") add("o/" + baseName(hit.path).toLowerCase(), 4);
      else {
        const lines = [];
        walkBlocks([hit.block], b => { lines.push(blockText(b)); });
        for (const l of linksIn(lines.join("\n"))) add(solRef(l), 3);
      }
    }
    // One step on, through the pages of the people and organisations themselves.
    const direct = new Set([...m.keys()]);
    for (const p of allPages(q => ["person", "org"].includes(pageKind(q)))) {
      const me = (pageKind(p) === "person" ? "p/" : "o/") + baseName(p).toLowerCase();
      const out = linksIn(Object.values(getPage(p)?.props || {}).join(" ")).map(solRef).filter(x => SOL_REF_RE.test(x));
      if (direct.has(me)) { for (const x of out) if (x !== me) add(x, 2); }
      else if (out.some(x => direct.has(x))) add(me, 2);
    }
    const area = areaOfProject(r.path);
    if (area) for (const p of projectsInArea(area)) {
      if (p === r.path) continue;
      for (const l of linksIn(Object.values(getPage(p)?.props || {}).join(" "))) add(solRef(l), 1);
    }
    return m;
  }));
}
