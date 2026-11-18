/* Show step i. On the same slide only the bullets change: the new one fades
   in and the ones before it step back. Another slide moves in: the next one
   at the same level comes up from below (down the talk), a bullet's own
   lines are a detour in from the side, and back out the other way. */
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
    deck.dataset.move = !from ? "" : to.s.depth > from.s.depth ? "in" : to.s.depth < from.s.depth ? "out" : fwd ? "down" : "up";
    for (const gone of deck.querySelectorAll(".slide.out")) gone.remove();
    if (old) {
      old.classList.replace("cur", "out");
      setTimeout(() => old.remove(), 800);
    }
    const s = to.s;
    const slide = el("section", {class: "slide cur" + (s.cover ? " hascover" : "") + (s.block ? "" : " titleslide")});
    if (s.cover) {
      const img = /^(https?|data|blob):/.test(s.cover) ? el("img", {src: s.cover, alt: ""}) : el("img", {"data-asset": s.cover, alt: ""});
      slide.append(el("div", {class: "cover"}, img));
    }
    slide.append(el("div", {class: "stext"}, el("h1", {class: "stitle"}, s.title),
      el("ul", {class: "sbullets"}, ...s.kids.map(b => el("li", {class: "bullet later"}, slideWords(b))))));
    deck.append(slide);
    resolveAssets(slide);
    slideBullets(slide, to, false);
  }
  presenterDraw();
}
