function boardDirCard(r) {
  const {path, space} = r;
  const info = inSpace(space, () => ({
    title: pageTitle(path),
    ref: pageRef(path),
    links: backlinksTo(path).length,
    member: pageKind(path) === "person" && isMemberPage(path),
    open: pageKind(path) === "context" ? openPerContext().get(baseName(path)) || 0 : 0,
  }));
  const card = el("button", {
    class: "bcard", draggable: "true", data: {path},
    onclick: e => {
      if (boardPickClick(e, "dirpage", space + "|" + path)) return;
      if (e.target.closest("[data-link]")) return;
      openPageIn(space, path);
    },
  },
    el("div", {class: "bcard-title"}, info.title),
    el("div", {class: "bcard-meta"},
      multiSpace() ? spaceBadge(space) : null,
      el("span", {class: "chip"}, info.ref),
      info.member ? el("span", {class: "chip who"}, "in this area") : null,
      info.open ? el("span", {class: "chip"}, info.open + " open") : null,
      el("span", {class: "chip age"}, info.links + (info.links === 1 ? " mention" : " mentions"))));
  return makeCardDraggable(card, "dirpage", {page: r}, space + "|" + path);
}
