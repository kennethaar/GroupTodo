/* The draft for a project, or the plan read back off its page. */
function npmLoad(space, path) {
  return npmDraft(space, path) || inSpace(space, () => npmFromPage(space, path));
}
