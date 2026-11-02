/* Where the search was opened from, read as what it is probably for. */
function searchFilterForNow() {
  if (["next", "today", "waiting", "contexts"].includes(state.view)) return "todos";
  if (state.view === "projects") return "projects";
  if (state.view === "page" && state.pagePath && pageKind(state.pagePath) === "project") return "projects";
  return "all";
}
