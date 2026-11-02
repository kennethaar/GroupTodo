/* Alt-S: move what you are on to another space. */
function onSpaceKey(e) {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.code !== "KeyS") return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const card = state.view === "review" && subNow() === "projects" && SOL.order && SOL.order[SOL.i];
  let ctx = card && !e.target.closest?.(".blk") ? {space: card.space, path: card.path}
    : itemContext(e.target) || (state.pagePath ? {space: V.space, path: state.pagePath} : null);
  if (!ctx && state.selected) {
    for (const [space] of LOADED) {
      const hit = inSpace(space, () => findBlock(state.selected));
      if (hit) { ctx = {space, path: hit.path, id: state.selected}; break; }
    }
  }
  if (ctx) openItemSpacePicker(ctx);
  else notify("Pick a line, a page or a card first.", "warn");
}
