function openPersonPage(name) {
  if (samePerson(name, whoAmI())) { go("me"); return; }
  for (const n of visibleSpaces()) {
    if (!LOADED.has(n)) continue;
    const path = inSpace(n, () => V.pages.has(personPath(name)) ? personPath(name) : null);
    if (path) { openPageIn(n, path); return; }
  }
  followLink("p/" + name);
}
