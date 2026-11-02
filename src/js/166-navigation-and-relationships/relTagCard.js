/* Mark a card with what it stands for, so search, filter, nesting and drops
   can find it again. */
function relTagCard(card, r) {
  card.dataset.relId = relId(r);
  card.dataset.relKind = relKind(r);
  card.dataset.relText = (relTitle(r) + " " + relRef(r)).toLowerCase();
  card.dataset.relState = relState(r);
  relDropOnCard(card, r);
  return card;
}
