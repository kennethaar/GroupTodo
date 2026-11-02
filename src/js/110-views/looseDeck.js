function looseDeck() {
  return visibleSpaces().flatMap(sp => inSpace(sp, () => looseActions().map(a => ({...a, space: sp}))))
    .filter(a => !LOOSE.skipped.has(looseKey(a)))
    .sort((x, y) => (y.age ?? 0) - (x.age ?? 0));
}
