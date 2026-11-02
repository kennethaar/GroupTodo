function solClearDeck() {
  for (const k of [...SOL_ANS.keys()]) if ((k[0] === "@") === actDeckOn()) SOL_ANS.delete(k);
  solSaveAns();
}
