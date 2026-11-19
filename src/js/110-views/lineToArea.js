/* A line on a day page, or any page that is not a project: Alt+I, or the
   line menu, links it to a responsibility. A line that links a project turns
   that project into one instead. */
function lineToArea(path, block) {
  const linked = linksIn(block.title).map(findExistingPage).find(p => p && statusDirOf(p) && !isHorizonPage(p));
  if (linked) { projectToArea(linked); return; }
  const linkedArea = linksIn(block.title).map(findExistingPage).find(p => p && pageKind(p) === "area");
  if (linkedArea) { notify("Already under " + pageTitle(linkedArea) + "."); return; }
  pickAreaFor(path, block);
}
