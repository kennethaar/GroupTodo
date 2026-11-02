/* The same board, one level up: every project, in the status it is in, and a
   drag moves the file into the other status folder. The columns are the five
   the sidebar lists, so what you see here is what Projects shows one status at
   a time. */
function viewProjectBoard() {
  const c = el("div", {});
  BOARD_ITEMS = new Map();
  if (BOARD_SEL.mode !== "projects") { boardSelClear(); BOARD_SEL.mode = "projects"; }
  const stuck = new Set(stuckActiveProjects().map(x => x.path));
  const everyProject = BOARD_STATUS_COLUMNS.flatMap(code => projectsInVisible(code));
  // The list's Sort menu, so a column reads in the order the list does.
  const {sel: sortSel, apply: sortProjects} = projectSort();
  c.append(fbar(boardSpaceTabs(), boardFilterBar("projects", everyProject), sortSel, boardSelHost()));
  const shelf = hiddenColsBar("projects.status", k => STATUS_LABEL[k] || k);
  if (shelf) c.append(shelf);
  const putAway = hiddenCols("projects.status");
  const shownCols = orderedCols("projects.status", BOARD_STATUS_COLUMNS).filter(code => !putAway.has(code));

  const board = el("div", {class: "board" + (shownCols.length === 5 ? " five" : shownCols.length === 3 ? " three" : "")});
  if (shownCols.length && shownCols.length !== 5 && shownCols.length !== 3) board.style.gridTemplateColumns = "repeat(" + shownCols.length + ",minmax(0,1fr))";
  for (const code of shownCols) {
    const items = sortProjects(projectsInVisible(code)
      .filter(r => boardFilterKeep("projects", r)));
    const col = boardColumn(
      el("div", {class: "bcol-head"},
        el("span", {class: "st st-" + code, title: STATUS_TEXT[code]}, code),
        el("span", {class: "state", style: "border:0;background:transparent;padding:0"},
          STATUS_LABEL[code]),
        el("span", {class: "n"}, String(items.length)), colHideBtn("projects.status", code)),
      (kind, x) => kind === "project" && statusDirOf(x.project.path) !== code,
      x => {
        const {path, space} = x.project;
        const prev = inSpace(space, () => statusDirOf(path));
        const landed = join(STATUS_DIRS[code], baseName(path) + ".md");
        // A project of that name on the shelf already means the drop merges
        // the two, and a merge is not undone by moving the file back: that
        // would carry the other project off with it. The toast the merge puts
        // up has the undo for it.
        const onto = inSpace(space, () => V.pages.has(landed));
        inSpace(space, () => setProjectStatus(path, code));
        return () => inSpace(space, () => {
          if (onto) { notify("That one merged into the project already there, so there is no file to move back.", "warn"); return; }
          const from = V.pages.has(landed) ? landed : path;
          if (prev && STATUS_DIRS[prev]) setProjectStatus(from, prev, {undo: true});
        });
      });
    colDraggable(col, "projects.status", code);
    col.append(fillBoardColumn(
      el("div", {class: "bcol-body", data: {keepScroll: "projboard:" + code}}), items, "p:" + code,
      r => boardProjectCard(r, stuck)));
    board.append(col);
  }
  if (!shownCols.length) c.append(emptyCard("Every column is hidden. Click one above to show it again."));
  else c.append(boardMarquee(el("div", {class: "boardwrap boardscroll"}, board), "project"));
  c.append(el("p", {class: "hint"}, "Dragging a project moves its file to that folder, and every link to it " +
    "follows. Drop one on an area tab to move it into that area; hold ctrl to copy it instead."));
  return c;
}
