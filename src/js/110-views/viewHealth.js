function viewHealth() {
  const issues = healthScan();
  const c = el("div", {});
  const byType = new Map();
  for (const i of issues) { if (!byType.has(i.type)) byType.set(i.type, []); byType.get(i.type).push(i); }
  const twice = duplicateLinePages();
  if (!issues.length && !twice.length && !duplicateProjects().length) c.append(section("Health", 0, emptyCard("System healthy.")));
  for (const [type, items] of byType) {
    c.append(section(type.replace(/-/g, " "), items.length,
      pagedCard(items, i => el("button", {class: "dash-item", onclick: () => openPage(i.path)},
        el("span", {}, i.text), el("span", {class: "p"}, i.path)))));
  }
  const dupes = duplicateProjects();
  if (dupes.length) {
    const card = el("div", {class: "card"});
    for (const d of dupes) {
      card.append(el("div", {class: "dash-item"}, el("b", {}, d.slug), el("span", {class: "p"}, d.paths.length + " copies")));
      for (const p of d.paths) {
        card.append(el("div", {class: "prow"},
          el("button", {class: "nm", style: "text-align:left", onclick: () => openPage(p)}, p),
          el("span", {class: "sub"}, openTodoCount(p) + " open"),
          el("button", {class: "btn sm ghost", onclick: () => {
            d.paths.filter(x => x !== p).forEach(x => mergePages(x, p));
            render();
          }}, "keep this, merge rest")));
      }
    }
    c.append(section("duplicate projects", dupes.length, card));
  }
  /* Lines written twice, page by page, in every area on screen. One page at a
     time, or all of them at once; either way Undo puts them back. */
  if (twice.length) {
    const total = twice.reduce((n, x) => n + x.n, 0);
    const card = el("div", {class: "card"});
    for (const x of twice) card.append(el("div", {class: "prow"},
      multiSpace() ? spaceBadge(x.space) : null,
      el("button", {class: "nm", style: "text-align:left", onclick: () => openPageIn(x.space, x.path)}, inSpace(x.space, () => pageTitle(x.path))),
      el("span", {class: "sub"}, x.n + " twice"),
      el("button", {class: "btn sm ghost", onclick: () => inSpace(x.space, () => removeDuplicateLines([x.path]))}, "Remove")));
    const all = el("button", {class: "btn sm ghost", style: "margin-left:auto",
      title: "Every page listed here; Undo puts them all back",
      onclick: () => {
        const by = new Map();
        for (const x of twice) { if (!by.has(x.space)) by.set(x.space, []); by.get(x.space).push(x.path); }
        for (const [sp, paths] of by) inSpace(sp, () => removeDuplicateLines(paths));
      }}, "Remove all " + total);
    c.append(section("duplicate lines", twice.length, card, all));
  }
  return c;
}
