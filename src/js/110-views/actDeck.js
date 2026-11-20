function actDeck() {
  return actMineOpen().filter(a => !isChore(a) || choreStale(a))
    .map(a => Object.assign({}, a, {space: a.space || V.space}));
}
