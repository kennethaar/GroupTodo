/* Someday/maybe is Alt+2 on the line: a project on that shelf, linked from
   it -- or, when the line already links a project, that project moved there. */
function clSomeday(path, b) {
  const linked = linksIn(b.title).map(findExistingPage).find(p => p && statusDirOf(p) && !isHorizonPage(p));
  if (linked) { setProjectStatus(linked, "2", {ask: false}); return; }
  const name = bareLineName(b);
  if (name) insertMakeLink(path, b, "2/" + slugify(name));
}
