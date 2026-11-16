/* # Project? at the end of a task just added on a day page (#401). */
function askProjectButton(path, b) {
  if (ASK_PROJECT.id !== b.id || !b.state || !isJournalPath(path) || lineProject(path, b)) return null;
  return el("button", {class: "askproj", title: "Put it under a project (Alt+J)",
    onmousedown: e => e.preventDefault(),
    onclick: e => { e.stopPropagation(); pickLineProject(path, b); }}, "# Project?");
}
