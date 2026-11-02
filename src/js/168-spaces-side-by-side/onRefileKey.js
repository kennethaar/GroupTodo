/* Alt+G: refile the line you are on, or the selected one. */
function onRefileKey(e) {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.code !== "KeyG") return;
  if ($("#modalRoot").firstChild) return;
  let ctx = itemContext(e.target);
  if (!ctx?.id && state.selected) {
    for (const [space] of LOADED) {
      const hit = inSpace(space, () => findBlock(state.selected));
      if (hit) { ctx = {space, path: hit.path, id: state.selected}; break; }
    }
  }
  if (!ctx?.id) return;
  const hit = inSpace(ctx.space, () => findBlock(ctx.id));
  if (!hit) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (e.target.blur) e.target.blur();
  inSpace(ctx.space, () => openRefile(hit.path, hit.block));
}
