/* The dated lines already written about it. */
function doneComments(t) {
  const from = t.block ? t.block.children || [] : t.page.blocks;
  return from.filter(b => !b.state && !isMessage(b) && /^\[\[\d{4}-\d{2}-\d{2}\]\]/.test(b.title || ""));
}
