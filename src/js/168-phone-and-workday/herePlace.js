/* #408 Where I am, as the others in `space` see it: the page when it is
   one of theirs, else the view's name. */
function herePlace(space) {
  if (state.view === "page" && space === V.space && state.pagePath)
    return {page: state.pagePath, title: pageTitle(state.pagePath)};
  return {page: "", title: VIEW_TITLE[state.view] || ""};
}
