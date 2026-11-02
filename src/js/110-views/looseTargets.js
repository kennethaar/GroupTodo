// Where an action could go, in its own area: projects that can still take one, then responsibilities.
function looseTargets(a) {
  return inSpace(a.space, () => {
    const words = titleWords;
    const mine = words(a.title);
    const refs = new Set(linksIn(a.title).map(solRef));
    const shared = s => [...words(s)].filter(w => mine.has(w)).length;
    const projects = ["1", "3", "2"].flatMap(code => projectsIn(code).map(path => ({code, path})))
      .filter(x => !isTourProject(x.path))
      .map(x => {
        const r = {space: a.space, path: x.path};
        const names = [...projectPeople(r).map(n => "p/" + n), ...projectOrgs(r).map(n => "o/" + n)].map(n => n.toLowerCase());
        return {path: x.path, title: pageTitle(x.path), kind: STATUS_LABEL[x.code], first: x.code === "1" ? 1 : 0,
          score: shared(pageTitle(x.path)) * 2 + names.filter(n => refs.has(n)).length * 3};
      });
    const areas = areaList().map(p => ({path: p, title: pageTitle(p), kind: "Responsibility", first: 0,
      score: shared(pageTitle(p)) * 2 + (refs.has("a/" + baseName(p).toLowerCase()) ? 3 : 0)}));
    return [...projects, ...areas].sort((x, y) => y.score - x.score || y.first - x.first
      || x.title.localeCompare(y.title, undefined, {numeric: true, sensitivity: "base"}));
  });
}
