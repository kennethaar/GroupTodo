function branchToCut(e) {
  if ($("#modalRoot").firstChild) return null;
  /* Lines picked with the mouse or Esc are cut as the handful they are: the
     line remembered here would be the one the drag started on, and only it. */
  if (LINE_SEL.ids.length) return null;
  const ctx = itemContext(e.target);
  if (!ctx?.id || !wholeLineSelected(e.target)) return null;
  const hit = inSpace(ctx.space, () => findBlock(ctx.id));
  return hit ? {ctx, text: serializeBlocks([hit.block])} : null;
}
