// The next waiting slide (#486), round to the first after the last.
function slideWaitNext() {
  if (DECK?.wait) slideWaitShow(DECK.wait.n + 1);
}
