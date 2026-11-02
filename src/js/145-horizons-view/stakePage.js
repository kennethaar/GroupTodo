function stakePage(to) {
  if (to.org) { for (const n of visibleSpaces().filter(n => LOADED.has(n)).concat([V.space])) {
    const p = inSpace(n, () => findExistingPage("o/" + to.name));
    if (p) return {space: n, path: p};
  } return null; }
  const at = personPageAt(to.name);
  return inSpace(at.space, () => V.pages.has(at.path)) ? at : null;
}
