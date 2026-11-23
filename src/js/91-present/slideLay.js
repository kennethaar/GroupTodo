/* A slide's two looks (#431): first its title alone in the middle, the
   picture behind it on the whole screen; from the first bullet on, the
   picture on the left 30% and the title, smaller, at the top right over the
   bullets. The title glides from the one place to the other, in 1 s; true
   when it does, so the first bullet can wait for it. */
function slideLay(slide, laid) {
  const title = slide.querySelector(".stitle");
  const first = !slide.dataset.lay;
  if (!first && slide.classList.contains("intro") === !laid) return false;
  const was = first ? null : slideTitleNow(title);
  slide.classList.toggle("intro", !laid);
  slide.dataset.lay = "1";
  slideFit(slide);
  slideEven(slide);
  slideCycleFit(slide);
  if (first || matchMedia("(prefers-reduced-motion: reduce)").matches || !title.animate) return false;
  // A copy keeps the big title's line breaks on the way, so none is cut (#431).
  const deck = slide.closest("#deck, #deckpeek") || slide;
  // The slide's look has changed already, so the letters wear the new title's color.
  return !!slideGhost(deck, was, slideTitleNow(title), title, "to");
}
