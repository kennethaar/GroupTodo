/* Alt held on a slide (#487): what can move gets a dashed outline, and
   ↺ Reset slide shows top-right. on=false takes them away. */
function slideArrShow(on) {
  const deck = DECK?.deck;
  if (!deck || DECK.wait) return;
  deck.classList.toggle("arranging", on);
  deck.querySelector(".arrreset")?.remove();
  if (on) deck.append(el("button", {class: "arrreset", type: "button", title: "Take every move on this slide off",
    onpointerdown: e => e.stopPropagation(), onclick: () => slideArrReset()}, "↺ Reset slide"));
}
