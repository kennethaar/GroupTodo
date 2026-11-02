/* No project chosen: the ones that most need it first -- no outcome, then no next action. */
function npmPicker() {
  const rows = visibleSpaces().flatMap(sp => inSpace(sp, () => projectsIn("1").map(path => {
    const r = {space: sp, path};
    return {space: sp, path, title: pageTitle(path), noOut: !outcomeOf(path), noNext: !openOf(projectActions(r)).length,
      planned: !!getPage(path)?.props?.planned};
  }))).sort((a, b) => (b.noOut - a.noOut) || (b.noNext - a.noNext) || (a.planned - b.planned) || a.title.localeCompare(b.title));
  const head = el("div", {class: "npmq"}, el("div", {class: "eyebrow"}, "Natural planning"),
    el("h2", {}, "Which project do you want to plan?"),
    el("div", {class: "sub"}, "Six short steps, from why to the next action."));
  if (!rows.length) return [head, el("p", {class: "npmsay"}, "No active projects yet. Make one under Projects, and plan it from there.")];
  return [head, el("ul", {class: "npmpick"}, ...rows.slice(0, 40).map(r => el("li", {},
    el("button", {class: "pick", onclick: () => npmOpen(r.space, r.path)},
      el("span", {}, r.title),
      el("span", {class: "d"}, r.noOut ? "no outcome" : r.noNext ? "no next action" : r.planned ? "planned" : "")))))];
}
