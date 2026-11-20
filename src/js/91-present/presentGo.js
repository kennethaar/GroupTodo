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
    const move = !from ? "" : to.s.up === from.s ? "zoomin" : from.s.up === to.s ? "zoomout" : fwd ? "down" : "up";
    deck.dataset.move = move;
    for (const gone of deck.querySelectorAll(".slide.out")) gone.remove();
    // A line's place on a slide: a bullet, or its spot in a drawing (#433).
    const spot = (on, b) => b && on?.querySelector(`[data-bid="${CSS.escape(String(b.id))}"]`);
    // The line on the slide before, where the title grows from.
    const slot = move === "zoomin" && spot(old, to.s.block);
    if (old) {
      old.classList.replace("cur", "out");
      setTimeout(() => old.remove(), 1100);
    }
    const s = to.s;
    // The slide's picture and its parts' pictures (#464), one place, one shown at a time.
    const pics = [...new Set([s.cover, ...(s.pics || [])].filter(Boolean))];
    const slide = el("section", {class: "slide cur lay-" + s.layout + (pics.length ? " hascover" : "") + (s.block ? "" : " titleslide")});
    if (pics.length) slide.append(el("div", {class: "cover"}, ...pics.map(src => el("div", {class: "pic", "data-pic": src},
      /^(https?|data|blob):/.test(src) ? el("img", {src, alt: ""}) : el("img", {"data-asset": src, alt: ""})))));
    slide.append(el("div", {class: "stext"}, s.breadcrumb ? el("div", {class: "scrumb"}, s.breadcrumb) : null,
      el("h1", {class: "stitle"}, s.title), slideBody(s)));
    deck.append(slide);
    resolveAssets(slide);
    slideBullets(slide, to, false);
    if (move === "zoomin" && slot) slideZoom(slide.querySelector(".stitle"), slot, true);
    if (move === "zoomout" && old) slideZoom(old.querySelector(".stitle"), spot(slide, from.s.block), false);
  }
  presenterDraw();
}
