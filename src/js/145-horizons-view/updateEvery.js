function updateEvery(to) {
  const at = stakePage(to);
  const raw = at ? trim(String(inSpace(at.space, () => getPage(at.path)?.props?.[UPDATE_EVERY_PROP]) || "")).toLowerCase() : "";
  return UPDATE_EVERY.find(([v]) => v === raw) ? raw : UPDATE_EVERY_DEFAULT;
}
