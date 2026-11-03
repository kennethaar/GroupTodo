function viewBookPlot(c) {
  c.append(vhead(bookName(), null, viewSeg("book")));
  if (bookScopeBar()) c.append(el("div", {class: "fbar"}, bookScopeBar()));
  const {chapters, lines, loose} = bookPlot();
  if (!lines.length) {
    c.append(emptyCard("No plotlines yet. Name one under a scene's ## line, as plot:: The search, and it gets a row here."));
  } else {
    const grid = el("div", {class: "tlgrid plotgrid", style: `grid-template-columns:max-content repeat(${chapters.length}, minmax(110px, 1fr))`});
    // Across every book, a book's name over its first chapter, and each book counts from 1.
    const all = bookScope() === "all";
    grid.append(el("div", {class: "tlcorner"}), ...chapters.map((ch, i) => {
      const first = chapters.findIndex(x => x.book === ch.book);
      return el("div", {class: "tlhead"}, all && first === i ? el("span", {class: "tlbook"}, bookName(ch.book)) : null,
        (i - (all ? first : 0) + 1) + ". " + (ch.path ? pageTitle(ch.path) : ch.name));
    }));
    for (const line of lines) {
      grid.append(el("div", {class: "tllane"}, line.name));
      line.cells.forEach((cell, i) => grid.append(el("div", {class: "tlcell" + (line.gaps.has(i) ? " plotgap" : ""),
        title: line.gaps.has(i) ? line.name + " has been left alone for a while here" : ""},
        ...cell.map(sc => el("button", {class: "tlscene", title: sceneProp(sc.scene, "synopsis") || "Open it", onclick: () => openScene(sc.scene)},
          sc.scene.name || "Opening")))));
    }
    c.append(el("div", {class: "card tlcard"}, grid));
  }
  if (loose.length) c.append(section("Scenes with no plotline", loose.length, el("div", {class: "card rellist"}, ...loose.map(sc =>
    el("div", {class: "relrow"}, el("button", {class: "textbtn", title: "Say which plotlines it moves on", onclick: () => editScene(sc.scene)},
      sc.scene.name + " · " + pageTitle(sc.scene.path)))))));
  return c;
}
