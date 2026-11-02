/* The place on screen: a view and its reading, or the kind of page. */
function usageViewPlace() {
  if (state.view === "page") return "page/" + (state.pagePath ? pageKind(state.pagePath) : "page");
  return state.view + (SUBS[state.view] ? "/" + subNow() : "");
}
