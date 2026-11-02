function viewKindBoard() {
  const c = el("div", {});
  BOARD_ITEMS = new Map();
  if (BOARD_SEL.mode !== "dir") { boardSelClear(); BOARD_SEL.mode = "dir"; }
  c.append(fbar(boardSpaceTabs(), el("span", {class: "say right"}, "Drag a card into another column to change what it is."), boardSelHost()));
  const board = el("div", {class: "board ctxboard"});
  for (const kind of orderedCols("dir.kind", BOARD_KIND_COLUMNS)) {
    const items = dirPagesInVisible(kind).sort((x, y) =>
      rowTitle(x).localeCompare(rowTitle(y)));
    const col = boardColumn(
      el("div", {class: "bcol-head"}, kindDot(kind), el("span", {}, PAGE_KINDS[kind]), el("span", {class: "n"}, String(items.length))),
      (dkind, x) => dkind === "dirpage" && inSpace(x.page.space, () => pageKind(x.page.path)) !== kind,
      x => {
        const {path, space} = x.page;
        const was = inSpace(space, () => pageKind(path));
        const landed = join(DIR_OF_KIND[kind], baseName(path) + ".md");
        const onto = inSpace(space, () => V.pages.has(landed));
        inSpace(space, () => moveFile(path, landed));
        return () => inSpace(space, () => {
          if (onto) { notify("That one merged into the page already there, so there is no file to move back.", "warn"); return; }
          if (DIR_OF_KIND[was]) moveFile(landed, join(DIR_OF_KIND[was], baseName(path) + ".md"));
        });
      });
    colDraggable(col, "dir.kind", kind);
    col.append(fillBoardColumn(el("div", {class: "bcol-body", data: {keepScroll: "dirboard:" + kind}}), items, "d:" + kind, boardDirCard));
    board.append(col);
  }
  c.append(boardMarquee(el("div", {class: "boardwrap boardscroll"}, board), "dirpage"));
  return c;
}
