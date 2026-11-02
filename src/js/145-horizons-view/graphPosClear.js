function graphPosClear() {
  GRAPH_POS.clear();
  try { localStorage.removeItem(GRAPH_POS_KEY); } catch (_) {}
}
