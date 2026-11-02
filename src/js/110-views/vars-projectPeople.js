const projectPeople = r => inSpace(r.space, () => [...new Set(linksIn(getPage(r.path)?.props?.with || "")
  .map(l => trim(l.split("][")[0])).filter(l => l.startsWith("p/")).map(l => l.slice(2)))]);
