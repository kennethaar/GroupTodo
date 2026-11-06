/* A project card says the things you need in order to decide where it belongs:
   how much is open in it, whether anything can actually be started, what it is
   waiting on, and how long since anybody looked at it. */
function boardProjectCard(r, stuck) {
  const {path, space} = r;
  const info = inSpace(space, () => ({
    title: pageTitle(path),
    open: openTodoCount(path) + journalActionsFor(path).filter(x => OPEN_STATES[x.state]).length,
    reviewed: dateIn(getPage(path)?.props?.reviewed),
    blockers: blockersOf(path).map(pageTitle),
    area: areaOfProject(path),
    outcome: outcomeOf(path),
    purpose: trim(getPage(path)?.props?.purpose || ""),
  }));
  const idle = info.reviewed ? dateDiffDays(info.reviewed, todayISO()) : null;
  const code = statusDirOf(path);
  const twin = twinsOf(space, path);
  const card = el("button", {
    class: "bcard", draggable: "true",
    data: {path},
    onclick: e => {
      if (boardPickClick(e, "project", space + "|" + path)) return;
      if (e.target.closest("[data-link]")) return;
      openPageIn(space, path);
    },
  },
    parentLine(space, path),
    el("div", {class: "bcard-top"},
      el("span", {class: "st st-" + code, title: STATUS_TEXT[code]}, code),
      el("div", {class: "bcard-title"}, info.title)),
    // Why, from natural planning: on the card you point at, not on every card.
    info.purpose ? el("div", {class: "bcard-purpose", translate: "no"}, info.purpose) : null,
    el("div", {class: "bcard-meta"},
      multiSpace() ? spaceBadge(space) : null,
      info.area ? el("span", {class: "chip proj"}, info.area) : null,
      info.open ? el("span", {class: "chip"}, info.open + " open") : null,
      ...priceChips(projectTally({space, path})),
      (stuck.has(path) && space === Spaces.active)
        ? el("span", {class: "chip miss b"}, "no next action") : null,
      info.blockers.length ? el("span", {class: "chip late"}, "blocked by " + info.blockers.join(", ")) : null,
      idle != null ? el("span", {class: "chip age"}, "reviewed " + idle + "d ago") : null,
      twin ? el("span", {class: "chip late b",
        title: "Looks like " + twin.rows.filter(x => !(x.space === space && x.path === path)).map(x => x.title).join(", "),
        onclick: e => { e.stopPropagation(); openTwins(twin); }}, "looks alike") : null,
      r._urg != null ? el("span", {class: "chip urg", title: "Urgency of its most urgent open action, " +
        "or of its own deadline and chain when it has none"}, svgIcon(ICON_ARROW_UP), " " + r._urg) : null),
    projectFieldPills(r, {skip: ["status"]}));
  // Two spaces can hold the same path, so what makes a project card itself is
  // the space it is in as well as the file it is.
  return makeCardDraggable(card, "project", {project: r}, space + "|" + path);
}
