/* Show step i. On the same slide only the bullets change: the new one fades
   in and the ones before it step back. Another slide slides in: sideways at
   the same level, down into a line's lines, up out of them. */
function presentGo(i) {
  if (!DECK) return;
  const {steps, deck} = DECK;
  i = Math.max(0, Math.min(steps.length - 1, i));
  const from = steps[DECK.i], to = steps[i];
  const fwd = !from || i >= DECK.i;
  DECK.i = i;
  const old = deck.querySelector(".slide.cur");
  if (from && from.s === to.s && old) {
    slideBullets(old, to, fwd && to.k === from.k + 1);
  } else {
    const move = !from ? "" : to.s.depth > from.s.depth ? "down" : to.s.depth < from.s.depth ? "up" : "side";
    deck.dataset.move = move;
    deck.dataset.dir = fwd ? "on" : "back";
    for (const gone of deck.querySelectorAll(".slide.out")) gone.remove();
    if (old) {
      old.classList.replace("cur", "out");
      setTimeout(() => old.remove(), 400);
    }
    const s = to.s;
    const slide = el("section", {class: "slide cur" + (s.cover ? " hascover" : "") + (s.block ? "" : " titleslide")});
    if (s.cover) {
      const img = /^(https?|data|blob):/.test(s.cover) ? el("img", {src: s.cover, alt: ""}) : el("img", {"data-asset": s.cover, alt: ""});
      slide.append(el("div", {class: "cover"}, img));
    }
    slide.append(el("div", {class: "stext"}, el("h1", {class: "stitle"}, s.title), el("ul", {class: "sbullets"})));
    deck.append(slide);
    resolveAssets(slide);
    slideBullets(slide, to, false);
  }
  presenterDraw();
}
