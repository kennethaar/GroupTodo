/* A status set by hand is the project looked at, so it carries today's
   reviewed:: wherever it was set -- the board, the page, the review. Moved to
   waiting, it asks who it waits for, unless the page already says. ask: false
   is for a caller that asks itself; undo: true puts a move back and claims
   nothing. */
function setProjectStatus(path, code, {ask = true, undo = false} = {}) {
  if (!STATUS_DIRS[code]) return;
  const newPath = join(STATUS_DIRS[code], baseName(path) + ".md");
  /* Move first, stamp second. The page that is still there afterwards is the
     one to write the new status on -- and when the move merged into a project
     that was already on that shelf, the survivor already says so, and
     stamping the mover's dates over it would backdate what was finished
     there. */
  const wasDone = statusDirOf(path) === "0";
  const moved = newPath !== path ? moveFile(path, newPath) : false;
  if (code === "0" && !wasDone) {
    const at = moved ? newPath : path;
    const space = V.space, was = statusDirOf(path);
    /* Undo puts it back on the shelf it came from and claims nothing; a change
       is a status set by hand like any other. Either way it is found where the
       tick put it, and not at all once it has been moved on since. */
    const live = fn => inSpace(space, () => {
      if (!V.pages.has(at) || statusDirOf(at) !== "0") {
        notify(pageTitle(at) + " is not on the completed shelf any more, so it was left as it is.", "warn");
        return;
      }
      fn();
    });
    offerDone({kind: "project", space, path: at, title: pageTitle(at), label: pageTitle(at),
      day: todayISO(), at: Date.now(),
      undo: () => live(() => setProjectStatus(at, was || "1", {undo: true})),
      change: code => live(() => {
        if (code !== "hold") { setProjectStatus(at, code); return; }
        setProjectStatus(at, "1", {ask: false});
        const back = join(STATUS_DIRS["1"], baseName(at) + ".md");
        openProjectHold(V.pages.has(back) ? back : at);
      })});
  }
  if (moved !== "merged") {
    const live = moved ? newPath : path;
    const page = getPage(live);
    if (!page) return;
    page.props.status = STATUS_TEXT[code];
    runTemplateRules(page,"status",code === "0" ? "DONE" : code === "3" ? "WAIT" : code === "-" ? "CANCELLED" : "TODO");
    if (!undo) page.props.reviewed = todayStamp();
    touch(live);
    if (code === "3" && ask && !undo && !trim(page.props.waiting_for || "")) askWaitingFor(V.space, live);
    notify(moved ? "Moved to " + STATUS_TEXT[code] : "Status: " + STATUS_TEXT[code]);
  }
  if (moved && state.view === "page" && state.pagePath === path) state.pagePath = newPath;
  render();
  if (code === "0" && !wasDone && ask && !undo) offerCopyRefsOnDone(moved ? newPath : path);
}
