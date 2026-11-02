function viewRelationshipBoard() {
  const root = el("div", {},
    el("div", {class: "section"}, boardSpaceTabs(), relNestedToggle(),
      el("p", {class: "quiet"}, "Drop onto a card to link a child. Person + organisation links both ways. " +
        "Drop onto a column background to change a page type.")));
  const rows = relAll(), board = el("div", {class: "board rel-board"});
  const columns = [
    ["task", "Tasks", r => !!r.block],
    ["project", "Projects", r => relKind(r) === "project"],
    ["pages", "Zettels / other pages", r => !r.block && relKind(r) !== "project"],
  ];
  for (const [kind, title, keep] of columns) {
    const selected = rows.filter(keep);
    const col = el("div", {class: "bcol"},
      el("div", {class: "bcol-head"}, el("span", {}, title), el("span", {class: "n"}, String(selected.length))));
    const body = el("div", {class: "bcol-body", data: {keepScroll: "relationships:" + kind}});
    for (const r of selected) body.append(relCard(r));
    col.append(body);
    relTypeDrop(col, kind);
    board.append(col);
  }
  root.append(el("div", {class: "boardwrap"}, board));
  relNestBoard(root, rows);
  [...board.children].forEach((col, i) => relColumnSearch(col, "relationships:" + i));
  return root;
}
