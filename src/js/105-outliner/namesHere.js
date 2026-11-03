function namesHere(pages = false) {
  const found = acrossSpaces(() => {
    const out = [];
    const add = (kind, title, ref, aliases = []) => { if (title) out.push({kind, title, ref, aliases}); };
    for (const p of allPeople()) add("person", personName(p), pageRef(p), pageAliases(p));
    for (const m of members()) add("person", m.name, "p/" + m.name);
    for (const p of allPages(q => pageKind(q) === "org")) add("org", pageTitle(p), pageRef(p), pageAliases(p));
    for (const code of ["1", "3", "2"])
      for (const p of projectsIn(code)) add("project", pageTitle(p), pageRef(p), pageAliases(p));
    for (const p of areaList()) add("area", pageTitle(p), pageRef(p), pageAliases(p));
    for (const c of contextList()) add("context", c, "c/" + c, pageAliases(contextPath(c)));
    if (pages) {
      const chapters = new Set(seriesChapters().map(c => c.path));
      for (const p of allPages(q => (pageKind(q) === "zettel" || pageKind(q) === "page") && !q.startsWith(DIRS.lists + "/") && !chapters.has(q)))
        add("page", pageTitle(p), pageRef(p), pageAliases(p));
    }
    return out;
  });
  /* One row per ref, the first area's. A person is the one exception: with
     several areas on, acrossSpaces has marked each row with its area, and a
     person with a page in two of them is two rows, so the list can say which
     is which (#258). The link either row writes is the same [[p/...]]. */
  const seen = new Set(), out = [];
  for (const n of found) {
    const key = n.ref.toLowerCase() + (n.kind === "person" && n.space ? "\u0000" + n.space : "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}
