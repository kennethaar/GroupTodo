/* Organisations go on areas as well as projects: on an area, every project in
   it is theirs, which is usually what is meant -- one customer, one area. */
function orgBoard(orgs, projectsOf) {
  const names = [...new Map(orgs.map(o => {
    const n = inSpace(o.space, () => pageTitle(o.path));
    return [n.toLowerCase(), n];
  })).values()].sort((a, b) => a.localeCompare(b));
  const used = names.map(n => ({name: n, face: el("span", {class: "odot"}, n[0]), n: orgLinks(n)})).sort(byLinks(x => x.n, x => x.name));
  const item = x => ({name: x.name, face: x.face, sub: x.n ? String(x.n) : ""});
  const picker = trayPicker("org",
    "Drag an organisation onto an area or a project - on an area, every project in it is theirs - or, under People, onto somebody who works there. Or click one, then click the target.",
    [["In use", used.filter(x => x.n).map(item)], ["Not on anything yet", used.filter(x => !x.n).map(item)]],
    "Find an organisation");

  const {cur, keep, sel} = areaFilter(workingProjects(), "orgs.board.area");
  const onlyBare = String(PREF.get("orgs.board.bare", "0")) === "1";
  const drop = (space, path, title) => d => {
    if (inSpace(space, () => pageLinkPropAdd(path, "org", "o/" + d.name))) notify(d.name + " added to " + title + ".");
    else notify(d.name + " is already on " + title + ".");
    render();
  };
  const orgStake = (space, path) => o =>
    stake(o, el("span", {class: "odot sm"}, o[0]), () => removeLinkFromProp(space, path, "org", "o/" + o));
  const out = [];

  const areaCards = acrossSpaces(() => areaList().map(path => ({path})))
    .filter(a => cur !== "-" && (!cur || cur === baseName(a.path)))
    .map(a => {
      const name = baseName(a.path);
      const own = inSpace(a.space, () => linksWith(getPage(a.path)?.props, "o/"));
      if (onlyBare && own.length) return null;
      const n = inSpace(a.space, () => projectsInArea(name).length);
      const card = el("div", {class: "pcard", data: {q: (name + " " + own.join(" ")).toLowerCase()}},
        el("h4", {onclick: () => previewPage(a.space, a.path)}, name),
        el("div", {class: "t-meta"}, el("span", {class: "chip"}, n + (n === 1 ? " project" : " projects")), spaceTag(a.space)),
        el("div", {class: "stakes"}, ...(own.length ? own.map(orgStake(a.space, a.path))
          : [el("span", {class: "say"}, "No organisation. Drop one here.")])));
      return trayTarget(card, d => d.kind === "org", drop(a.space, a.path, name));
    }).filter(Boolean);
  if (areaCards.length) out.push(el("div", {class: "group"}, "Areas"), el("div", {class: "pcards"}, ...areaCards));

  for (const code of ["1", "3", "2"]) {
    const cards = visibleProjects(code).filter(keep).map(r => {
      const title = rowTitle(r);
      const own = inSpace(r.space, () => linksWith(getPage(r.path)?.props, "o/"));
      const via = inSpace(r.space, () => areaOrgsOf(r.path)).filter(o => !own.includes(o));
      if (onlyBare && (own.length || via.length)) return null;
      const area = areaOfRow(r);
      const card = projectCard(r, title, [
        ...own.map(orgStake(r.space, r.path)),
        ...via.map(o => el("span", {class: "stake inh", title: "Through the area " + area}, el("span", {class: "odot sm"}, o[0]), o)),
        ...(own.length || via.length ? [] : [el("span", {class: "say"}, "No organisation. Drop one here.")])], null, [...own, ...via]);
      return trayTarget(card, d => d.kind === "org", drop(r.space, r.path, title));
    }).filter(Boolean);
    if (cards.length) out.push(el("div", {class: "group"}, STATUS_LABEL[code] + " projects"), el("div", {class: "pcards"}, ...cards));
  }
  if (!out.length) out.push(emptyCard("Nothing to show."));
  const bare = fchip("Only without one", onlyBare, () => { PREF.set("orgs.board.bare", onlyBare ? "0" : "1"); render(); });
  const onto = PREF.get("orgs.board.onto", "work") === "people" ? "people" : "work";
  const tabs = ontoTabs("Drag an organisation to:", "orgs.board.onto", onto, [["work", "Projects and areas"], ["people", "People"]]);
  const everyone = onto === "people" ? personDropCards() : [];
  const people = everyone.filter(card => !placedHidden() || card.querySelector(".stakes .say"));
  const right = onto === "people"
    ? assignTargets([people.length ? el("div", {class: "pcards"}, ...people)
        : emptyCard(everyone.length ? "Everybody works somewhere already." : "Nobody to show.")],
        [placedChip(everyone.length - everyone.filter(card => card.querySelector(".stakes .say")).length)], "Find a person")
    : assignTargets(out, [sel, bare], "Find an area or project");
  return el("div", {}, tabs, el("div", {class: "assign"}, picker, right));
}
