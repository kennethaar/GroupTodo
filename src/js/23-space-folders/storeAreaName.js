function storeAreaName(name) {
  const sp = Spaces.get(name);
  const rec = LOADED.get(name);
  if (!rec || rec.hold || folderMissing(name) || !areaNameChosen(sp)) return;
  inSpace(name, () => { if (!trim(String(getSetting("area_name") || ""))) setSetting("area_name", sp.name); });
}
