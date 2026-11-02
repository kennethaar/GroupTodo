/* When the last open action in an active/waiting project closes. */
function checkProjectCompletion(path) {
  const code = statusDirOf(path);
  if (code !== "1" && code !== "3") return;
  const page = getPage(path); if (!page) return;
  // A waiting-for is still something going on, so it keeps the project quiet.
  if (flattenBlocks(page.blocks).some(b => OPEN_STATES[b.state] && !isMessage(b))) return;
  // Steps written in a day page under [[1/this project]] count too.
  if (projectActions({path, space: V.space}).some(a => OPEN_STATES[a.state])) return;
  projectCompletionPrompt(path);
}
