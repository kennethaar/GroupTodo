/* A project renamed to the name of one on another shelf would be one project
   in two folders, and the next load keeps only the newer file (dropLeftovers)
   -- the one just renamed. An active project quietly became the completed one.
   So it asks, and the answer it leans to is the shelf the project already
   there is on: renaming an old project does not close a live one. */
function askRenameOntoTwin(path, twin, want) {
  const mine = statusDirOf(path), theirs = statusDirOf(twin);
  const keep = want || theirs, other = keep === theirs ? mine : theirs;
  const viewing = state.view === "page" && state.pagePath === path;
  const join1 = code => {
    closeModal();
    let into = twin;
    if (statusDirOf(twin) !== code) {
      setProjectStatus(twin, code, {ask: false});
      into = join(STATUS_DIRS[code], baseName(twin) + ".md");
    }
    if (mergePageInto(path, into) && viewing) state.pagePath = into;
    render();
  };
  const shelf = c => STATUS_LABEL[c].toLowerCase();
  modal({
    center: true, title: pageTitle(twin) + " is already a project", hint: "Enter / o / n",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13.5px"},
          "There is a " + shelf(theirs) + " project called " + pageTitle(twin) + ", and " + pageTitle(path) +
          " is " + shelf(mine) + ". Two projects cannot share a name, so the two would become one page.")),
      pickRow("↵", "Make them one, " + shelf(keep), "the lines of both on one page", () => join1(keep)),
      pickRow("o", "Make them one, " + shelf(other), "", () => join1(other)),
      pickRow("n", "Keep the old name", pageTitle(path) + " stays as it is", closeModal)),
    onClose: render,
    onKey: e => {
      if (e.key === "Enter") { join1(keep); return true; }
      if (e.key === "o") { join1(other); return true; }
      if (e.key === "n") { closeModal(); return true; }
      return false;
    },
  });
}
