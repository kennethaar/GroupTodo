function personDropCards() {
  return peopleRows().slice().sort(byLinks(personLinks, p => p.name)).map(p => {
    const orgs = personOrgs(p.name);
    const card = el("div", {class: "pcard", data: {q: [p.name, ...orgs].join(" ").toLowerCase()}},
      el("h4", {onclick: () => openPersonPage(p.name)}, personBareName(p.name) + (p.me ? " (you)" : "")),
      el("div", {class: "t-meta"}, el("span", {class: "chip"}, p.open.length + " open")),
      el("div", {class: "stakes"}, ...(orgs.length ? orgs.map(o => worksAtStake(p.name, o, el("span", {class: "odot sm"}, o[0]), o))
        : [el("span", {class: "say"}, "No organisation. Drop one here.")])));
    return trayTarget(card, d => d.kind === "org", d => linkPersonToOrg(p.name, d.name));
  });
}
