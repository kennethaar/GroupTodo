function projectToTodoAs(path, how) {
  const page = getPage(path);
  if (!page) return;
  const code = statusDirOf(path), area = areaOfProject(path), title = pageTitle(path);
  const home = (area && findExistingPage("a/" + area)) || ensureJournal(todayISO());
  const b = newBlock({state: code === "3" ? "WAIT" : code === "0" ? "DONE" : code === "-" ? "CANCELLED" : "TODO", title});
  applyTodoTemplate(b);
  if (how === "page") {
    /* The page stays, as a plain page, carrying the project's lines; moving
       it rewrites every link on the way. The todo is a link to it. */
    const plain = join(PAGES, baseName(path) + ".md");
    if (!moveFile(path, plain)) return;
    const kept = getPage(plain);
    for (const k of ["status", "area", "reviewed", "deadline", "depends_on"]) delete kept.props[k];
    touch(plain);
    b.title = "[[" + pageRef(plain) + "]]";
    getPage(home).blocks.push(b);
    touch(home);
  } else {
    b.children = (page.blocks || []).map(cloneBlock);
    getPage(home).blocks.push(b);
    touch(home);
    if (how === "here") {
      const to = pageRef(home);
      let n = 0;
      for (const old of spellingsOf(path)) n += rewriteLinksEverywhere(old, to);
      if (n) notify("Links on " + n + (n === 1 ? " page" : " pages") + " now point to " + pageTitle(home) + ".");
    }
    deletePageWithUndo(path);
  }
  clearMemo();
  openPage(home);
  focusBlock(b.id);
  notify("“" + pageTitle(home) + "” now has " + title + " as a todo." + (how === "page" ? "" : " Ctrl-Z brings the project back."));
}
