function castEntries() {
  return memo("castEntries\u0000" + V.space, () => {
    const out = allPages(p => !!castType(p)).map(p => ({key: p, path: p, name: pageTitle(p), type: castType(p),
      names: castNamesOf(pageTitle(p), pageAliases(p), castType(p))}));
    const known = ref => {
      const p = findExistingPage(ref), shown = nameShown(ref).toLowerCase();
      return out.find(e => (p && e.path === p) || e.names.some(n => n.toLowerCase() === shown));
    };
    for (const ch of seriesChapters()) for (const s of ch.path ? chapterScenes(ch.path) : [])
      for (const ref of [...namesIn(sceneProp(s, "pov")), ...namesIn(sceneProp(s, "with"))])
        if (!known(ref)) out.push({key: "\u0000" + nameShown(ref).toLowerCase(), path: null, name: nameShown(ref), type: "character",
          names: castNamesOf(nameShown(ref))});
    out.known = known;
    return out;
  });
}
