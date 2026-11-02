function relDragged() {
  if (!DRAGGED) return [];
  return DRAGGED.items.map(x => x.rel || x.action || x.project || x.page).filter(Boolean);
}
