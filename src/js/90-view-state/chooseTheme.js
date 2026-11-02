function chooseTheme(id) {
  const t = THEMES.find(x => x.id === id);
  if (!t) return;
  PREF.set("theme." + t.side, t.id);
  applyStyles();
  if (themeSide() !== t.side) setThemeSide(t.side); else render();
}
