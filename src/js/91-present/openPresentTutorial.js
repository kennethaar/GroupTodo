/* Help's Open the Present tutorial (#484): the Present tutorial page in this
   area, made the first time and opened as you left it after that. Returns
   its path. */
function openPresentTutorial() {
  let path = findExistingPage(PRESENT_TUTORIAL_TITLE);
  if (!path) {
    path = resolveWikiPath(PRESENT_TUTORIAL_TITLE);
    putPage(path, parsePage(PRESENT_TUTORIAL));
    notify("Made the Present tutorial page. Press ▶ Present to learn by presenting it.");
  }
  openPage(path);
  return path;
}
