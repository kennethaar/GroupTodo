function navHidden() {
  const raw = getPage(SIDEBAR_PATH)?.props?.hide;
  const ids = String(raw || "").split(",").map(navIdOf).filter(id => id && id !== NAV_KEEP);
  return new Set(ids);
}
