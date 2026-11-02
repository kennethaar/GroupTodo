/* Alt+I, and the line menu's row. On a project's own page the project
   becomes a responsibility; any other line is linked to one -- or, when it
   links a project, that project becomes one. Words picked inside a line
   become the link where they stand, like the other kind keys. */
function areaFromLine(path, block) {
  if (statusDirOf(path) && !isJournalPath(path) && !isHorizonPage(path) &&
      !linksIn(block.title).some(l => statusDirOf(findExistingPage(l) || "")))
    projectToArea(path);
  else lineToArea(path, block);
}
