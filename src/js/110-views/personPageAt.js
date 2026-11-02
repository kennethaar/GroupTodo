// The page that says where somebody works, in whichever area has it.
function personPageAt(person) {
  const space = visibleSpaces().find(n => LOADED.has(n) && inSpace(n, () => V.pages.has(personPath(person)))) || V.space;
  return {space, path: personPath(person)};
}
