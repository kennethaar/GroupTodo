/* Every name worth offering, across the spaces on screen. */
function nameIndex() {
  return memo("nameIndex", () => {
    const seen = new Set(), out = [];
    const add = (kind, title, ref, aliases = []) => {
      const key = ref.toLowerCase();
      if (!title || seen.has(key)) return;
      seen.add(key);
      out.push({kind, title, ref, aliases});
    };
    acrossSpaces(() => {
      for (const p of allPeople()) add("person", personName(p), pageRef(p), pageAliases(p));
      for (const m of members()) add("person", m.name, "p/" + m.name);
      for (const p of allPages(q => pageKind(q) === "org")) add("org", pageTitle(p), pageRef(p), pageAliases(p));
      for (const code of ["1", "3", "2"])
        for (const p of projectsIn(code)) add("project", pageTitle(p), pageRef(p), pageAliases(p));
      for (const p of areaList()) add("area", pageTitle(p), pageRef(p), pageAliases(p));
      for (const c of contextList()) add("context", c, "c/" + c, pageAliases(contextPath(c)));
      return [];
    });
    return out;
  });
}
