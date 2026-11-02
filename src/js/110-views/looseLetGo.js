function looseLetGo(a) {
  inSpace(a.space, () => setBlockState(a.path, a.block, "CANCELLED"));
  LOOSE.q = "";
  render();
  notify("Let go. It stays on its day page, crossed out.");
}
