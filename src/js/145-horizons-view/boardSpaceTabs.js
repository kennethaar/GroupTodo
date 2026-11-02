/* The row itself. One tab per space plus All, the current choice highlighted,
   and every named tab a place a project card can be dropped. */
function boardSpaceTabs() {
  if (Spaces.list.length < 2) return null;         // nothing to choose between
  const all = Spaces.list.map(sp => sp.name);
  const vis = new Set(visibleSpaces());
  const showingAll = all.every(n => vis.has(n));

  const show = async names => {
    setVisibleSpaces(names);
    await ensureVisibleLoaded();
    // Whatever captures land in has to be one of the spaces on screen. Opening a
    // space lands on Today, which is right when you asked for the space and
    // wrong when you asked for a tab, so the board is where this comes back to.
    if (!names.includes(Spaces.active)) await openSpace(names[0]);
    state.boardMore = {};
    render();
  };

  const row = el("div", {class: "btabs"});
  row.append(el("button", {
    class: "btab" + (showingAll ? " on" : ""), onclick: () => show(all),
    title: "Every area at once",
  }, "All"));

  for (const sp of Spaces.list) {
    const on = !showingAll && vis.has(sp.name);
    const tab = el("button", {
      class: "btab" + (on ? " on" : ""), onclick: () => show([sp.name]),
      title: "Only " + sp.name + ", or drop a page here to move it into " + sp.name +
             " (hold ctrl to copy it instead)",
    },
      el("span", {class: "btab-dot", style: "background:" + spaceColor(sp.name)}),
      sp.name);

    /* A project, a person, an org or a context dropped here changes vault -- a
       page is a file, and a space is a folder. A task cannot: a task is a line
       in a day page, and the day page is not what is being dragged. */
    const takes = d => !!d && !!boardPageItems(d) &&
      boardPageItems(d).some(x => x.space !== sp.name);
    tab.addEventListener("dragover", e => {
      if (!takes(DRAGGED)) return;
      e.preventDefault();
      // Ctrl -- cmd on a Mac -- copies, the way it does in a file manager, and
      // the pointer says which one is about to happen.
      try { e.dataTransfer.dropEffect = copyDrag(e) ? "copy" : "move"; } catch (_) {}
      tab.classList.toggle("copying", copyDrag(e));
      tab.classList.add("over");
    });
    tab.addEventListener("dragleave", () => tab.classList.remove("over", "copying"));
    tab.addEventListener("drop", e => {
      e.preventDefault();
      tab.classList.remove("over", "copying");
      const d = DRAGGED;
      DRAGGED = null;
      if (!takes(d)) return;
      const list = boardPageItems(d)
        .filter(x => x.space !== sp.name)
        .map(x => ({path: x.path, from: x.space}));
      boardSelClear();
      dropPagesOnSpace(list, sp.name, {copy: copyDrag(e)});
    });
    row.append(tab);
  }
  return row;
}
