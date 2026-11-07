function npmHead(q) {
  const area = npmIn(() => areaOfProject(NPM.path));
  const qs = npmQs(NPM.step), s = NPM_STEPS[NPM.step];
  const where = q.k === "item" ? (q.it.kind === "comp" ? "Component " + (q.n + 1) + " of " + q.of + " that can start now"
      : "Next action " + (q.n + 1) + " of " + q.of)
    : q.k === "first" && npmLoose().length > 1 ? "Placing actions · " + npmUnplaced(npmLoose()).length + " of " + npmLoose().length + " left"
    : q.k === "sort" && NPM.ideas.length ? "Sorting ideas · " + npmUnsorted().length + " of " + NPM.ideas.length + " left"
    : "Step " + (NPM.step + 1) + " · " + s.name + (qs.length > 1 ? " · question " + (NPM.q + 1) + " of " + qs.length : "");
  return el("div", {class: "npmq"},
    el("div", {class: "eyebrow"}, npmIn(() => pageTitle(NPM.path)) + (area ? " · " + area : "")),
    el("div", {class: "eyebrow"}, where),
    el("h2", {}, q.k === "item" && q.it.kind === "comp" ? q.it.c.name : q.k === "sort" && !NPM.ideas.length ? "No ideas to sort" : q.ask),
    q.k === "item" && q.it.kind === "comp" ? el("div", {class: "sub"}, q.ask) : q.sub ? el("div", {class: "sub"}, q.sub) : null);
}
