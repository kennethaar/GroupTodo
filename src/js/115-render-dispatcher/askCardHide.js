function askCardHide() {
  clearTimeout(ASK_SHOW); clearTimeout(ASK_HIDE);
  if (ASK_CARD) { ASK_CARD.box.remove(); ASK_CARD = null; }
}
