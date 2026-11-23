function actDeck() {
  return actMineOpen().filter(a => !noWords(a.block) && (!isChore(a) || choreStale(a)))
    .map(a => Object.assign({}, a, {space: a.space || V.space}));
}
