/* Show step i. On the same slide only the bullets change: the new one fades
   in and the ones before it step back. Another slide moves in: the next one
   comes up from below (down the talk), the one before from above. Into a
   bullet's own lines the bullet grows from its place into the title, and on
   the way back out the title shrinks into it again. */
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
    const into = from && from.s.kids.indexOf(to.s.block), outOf = from && to.s.kids.indexOf(from.s.block);
    const move = !from ? "" : into >= 0 ? "zoomin" : outOf >= 0 ? "zoomout" : fwd ? "down" : "up";
    deck.dataset.move = move;
    for (const gone of deck.querySelectorAll(".slide.out")) gone.remove();
    // The line on the slide before, where the title grows from.
    const slot = move === "zoomin" && old?.querySelectorAll(".sbullets > .bullet")[into];
    if (old) {
      old.classList.replace("cur", "out");
      setTimeout(() => old.remove(), 1100);
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
    if (move === "zoomin" && slot) slideZoom(slide.querySelector(".stitle"), slot, true);
    if (move === "zoomout" && old) slideZoom(old.querySelector(".stitle"), slide.querySelectorAll(".sbullets > .bullet")[outOf], false);
  }
  presenterDraw();
}
