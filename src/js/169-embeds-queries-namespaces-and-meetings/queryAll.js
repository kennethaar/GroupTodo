function queryAll(src, skip) {
  const q = parseQuery(src);
  const pages = [...V.pages.keys()].filter(p => !isArchived(p) && pageKind(p) !== "verb")
    .sort((a, b) => {
      const da = dayOfPath(a), db = dayOfPath(b);
      if (da && db) return db.localeCompare(da);
      if (da || db) return da ? -1 : 1;
      return pageTitle(a).localeCompare(pageTitle(b));
    });
  if (isPageQuery(q)) return {pages: true, rows: pages.filter(p => queryMatch(q, {path: p, block: null,
    text: () => pageTitle(p).toLowerCase(), links: () => false, day: () => dayOfPath(p)})).map(p => ({path: p}))};
  const rows = [];
  // A link in a line's own values (with:: [[p/Ola]]) counts too; the index only reads its words.
  const propRefs = b => {
    const vals = Object.values(b.props || {}).filter(v => /\[\[|#/.test(v));
    return vals.length ? refsOfText(vals.join("\n")) : null;
  };
  for (const path of pages) {
    const page = getPage(path);
    const day = dayOfPath(path);
    const walk = (blocks, trail) => {
      for (const b of blocks || []) {
        if (b === skip) continue;
        if (isMessage(b)) continue;
        let text = null, own;
        const x = {path, block: b,
          text: () => text ?? (text = [b.title, ...(b.body || [])].join("\n").toLowerCase()),
          links: L => L.set.has(b) || trail.some(a => L.set.has(a)) ||
            !!(own === undefined ? (own = propRefs(b)) : own)?.has(L.key),
          day: () => day || addedDate(b)};
        if (queryMatch(q, x)) rows.push({path, block: b, trail});
        walk(b.children, [...trail, b]);
      }
    };
    walk(page.blocks, []);
  }
  return {pages: false, rows};
}
