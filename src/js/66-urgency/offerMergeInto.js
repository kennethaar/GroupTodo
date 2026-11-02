/* A rename or a move onto a name that is taken: say so, and offer to merge
   the page into the one there, links and all, the way a look-alike does. */
function offerMergeInto(path, into) {
  const space = V.space, title = pageTitle(into);
  notify(title + " is there already.", "warn", {label: "Merge into " + title, run: () => inSpace(space, () => {
    if (!mergePageInto(path, into)) return;
    syncCtxChildren(ctxParentPath(path));
    if (state.view === "page" && state.pagePath === path) state.pagePath = into;
    clearMemo(); render();
  })});
}
