/* Its page into the old one's, and every link to it with it; one named only
   on tasks just has its links moved. Every page it touches is kept as it was,
   so Undo puts the context and its links back, not only the page. */
function mergeContextInto(name, old, said = "@" + name + " is now @" + old + ".") {
  const from = contextPath(name), into = contextPath(old), parent = ctxParentPath(from);
  const needle = ("c/" + name).toLowerCase();
  const snaps = [...V.pages].filter(([p]) => p === from || p === into || p === parent)
    .map(([p, page]) => [p, serializePage(page)])
    .concat([...V.pages].filter(([p]) => p !== from && p !== into && p !== parent)
      .map(([p, page]) => [p, serializePage(page)]).filter(([, t]) => t.toLowerCase().includes(needle)));
  const hadInto = V.pages.has(into);
  NOTIFY_MUTE++;
  try {
    if (!hadInto) putPage(into, pageTemplateFor("c", old));
    if (V.pages.has(from)) mergePageInto(from, into, {undo: false});
    else rewriteLinksEverywhere("c/" + name, "c/" + old);
    syncCtxChildren(parent);
  } finally { NOTIFY_MUTE--; }
  if (state.view === "page" && state.pagePath === from) state.pagePath = into;
  const space = V.space;
  const undo = () => inSpace(space, () => {
    if (!hadInto && V.pages.has(into)) removePage(into);
    for (const [p, t] of snaps) { putPage(p, parsePage(t)); V.removed.delete(p); dropTombstone(p); touchHere(p); }
    if (state.view === "page" && state.pagePath === into && !hadInto) state.pagePath = from;
    clearMemo(); render();
    return true;
  });
  pushUndo({run: undo});
  notify(said, "info", {label: "Undo", run: undo});
  clearMemo(); render();
}
