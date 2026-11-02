/* A line that is nothing but a project's link -- alt-1 made it out of the
   words that were there -- and then turns out to be one step. Making it a
   task takes the 1/ back off: the page stays, as a plain page with whatever
   was written on it -- outcome, area and the rest -- and the line becomes
   the task linking to it. The project's open steps stay on the page and go
   under the task as ((references)), so it waits for them to be done first.
   A plain page of that name already there takes the project's lines in.
   Returns false for any other line. */
function projectLineToTask(path, block) {
  if (block.state || bareLineName(block)) return false;
  const proj = linksIn(block.title).map(findExistingPage).find(p => p && p !== path && statusDirOf(p) && !isHorizonPage(p));
  if (!proj) return false;
  const code = statusDirOf(proj), title = pageTitle(proj);
  const st = code === "3" ? "WAIT" : code === "0" ? "DONE" : code === "-" ? "CANCELLED" : "TODO";
  const plain = join(PAGES, baseName(proj) + ".md");
  const merged = V.pages.has(plain);
  const snap = structuredClone(getPage(path)), props = structuredClone(getPage(proj).props), space = Spaces.active;
  /* The outermost open steps, given their id:: before the move so it goes
     with them; one under another is already waited for by it. */
  const ids = [];
  const pick = list => { for (const b of list || []) { if (OPEN_STATES[b.state] && !isMessage(b)) ids.push(ensureBlockId(proj, b)); else pick(b.children); } };
  pick(getPage(proj).blocks);
  // moveFile rewrites every link on the way, this line's among them.
  if (!moveFile(proj, plain)) return true;
  // Only the status goes, which the task now carries; the rest is the page's own.
  delete getPage(plain).props.status;
  touch(plain);
  block.children = (block.children || []).concat(ids.map(id => newBlock({title: "((" + id + "))"})));
  block.state = st;
  applyTodoTemplate(block);
  runTemplateRules(block, "status", st);
  stampAddedIfMissing(path, block);
  touch(path);
  clearMemo();
  render();
  if (merged) {
    notify("“" + title + "” is a task now; its lines went onto the page “" + pageTitle(plain) + "” it links to.");
    return true;
  }
  const restore = () => {
    let ok = false;
    inSpace(space, () => {
      if (!getPage(path) || !getPage(plain) || V.pages.has(proj) || !moveFile(plain, proj)) return;
      Object.assign(getPage(proj).props, props);
      touch(proj);
      Object.assign(getPage(path), structuredClone(snap));
      touch(path);
      ok = true;
    });
    if (ok) { clearMemo(); render(); notify("Put the project “" + title + "” back."); }
    return ok;
  };
  pushUndo({run: restore, label: "Project to task " + title});
  notify("“" + title + "” is a task now; its page stays, without the 1/, and the task links to it.", "info", {label: "Undo", run: restore});
  return true;
}
