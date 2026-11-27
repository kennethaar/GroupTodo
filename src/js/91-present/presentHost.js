/* The slides put up (#515): in a window of their own, or in this tab when
   host is null. Keys there run the talk; closing a window of their own ends
   it. */
function presentHost(host) {
  const {deck} = DECK, w = host || window;
  (host ? host.document : document).body.append(deck);
  DECK.win = host; DECK.later = false;
  w.addEventListener("keydown", presentKey, true);
  w.addEventListener("keyup", slideArrKey, true);
  // The boxes of Alt held go with Alt (#487).
  w.addEventListener("blur", slideArrLost);
  w.addEventListener("pointermove", slideArrLost, true);
  host?.addEventListener("pagehide", slidesWinGone);
  if (host) deck.append(el("button", {class: "deckfull", type: "button", title: "Full screen (F)", onclick: slideFull}, "⛶ Full screen (F)"));
}
