function orgDropCards() {
  const orgs = [...new Map(dirPagesInVisible("org").map(o => [baseName(o.path).toLowerCase(), o])).values()]
    .sort(byLinks(o => orgLinks(baseName(o.path)), o => baseName(o.path)));
  return orgs.map(o => {
    const name = baseName(o.path), who = orgPeople(name);
    const card = el("div", {class: "pcard", data: {q: [name, ...who].join(" ").toLowerCase()}},
      el("h4", {onclick: () => previewPage(o.space, o.path)}, name),
      el("div", {class: "t-meta"}, el("span", {class: "chip"}, who.length + (who.length === 1 ? " person" : " people")), spaceTag(o.space)),
      el("div", {class: "stakes"}, ...(who.length ? who.map(n => worksAtStake(n, name, avatarNode(n, 18), personBareName(n)))
        : [el("span", {class: "say"}, "Nobody yet. Drop a person here.")])));
    return trayTarget(card, d => d.kind === "person", d => linkPersonToOrg(d.name, name));
  });
}
