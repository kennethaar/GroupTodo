function setThemeSide(side) {
  const r = document.documentElement;
  if (side) r.dataset.theme = side; else delete r.dataset.theme;
  safeLS.set("gtd.theme", side || "");
  render();               // the graph reads its colours from the theme
}
