/* ---------- the startup question ---------- */
function spacesNeedingStorage() {
  return Spaces.list.filter(sp => sp.kind === "local" && !sp.askedStorage);
}
