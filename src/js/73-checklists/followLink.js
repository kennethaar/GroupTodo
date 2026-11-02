/* Follow [[target]] -- creating the page if it does not exist yet. Whatever it
   lands on is brought to the middle of the screen, so the eye does not have
   to hunt for it: the task itself for a [[page#^id]] link, the title for a page. */
function followLink(target) {
  const task = relResolve(target, V.space);
  if (task && task.block) {
    openPage(task.path);
    requestAnimationFrame(() => centerLinkText(document.querySelector(idSel(".blk", task.block.id, ".txt"))));
    return;
  }
  openLinkTarget(target);
  requestAnimationFrame(() => centerLinkText($("#content .h-title, #content h1, #content h2")));
}
