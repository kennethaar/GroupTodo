/* Where the camera is on the slide shown now (#485). By itself: big on a
   title alone, a bubble in the corner on other slides, and on a slide with a
   picture the picture first, then you in its place (the whole slide while the
   title is alone, else the left 30%). A bullet that brings its own picture
   shows it first again. A mode picked for this slide, with C or the presenter
   window's strip, holds until the slide changes. */
function slideCamShow() {
  const c = DECK?.cam, here = DECK?.steps[DECK.i];
  if (!c || !here) return;
  const s = here.s, deck = DECK.deck, slide = deck.querySelector(".slide.cur");
  if (c.pick && c.pick.s !== s) c.pick = null;
  const pics = [s.cover, ...(s.pics || [])].filter(Boolean);
  c.auto = pics.length ? "side" : !s.block || !s.parts.length ? "big" : "bubble";
  const pic = pics.length ? slidePicNow(s, here.k) : "";
  if (pic !== c.pic) { c.pic = pic; c.picAt = Date.now(); }
  clearTimeout(c.timer);
  let mode = c.pick ? c.pick.mode : c.auto;
  if (!c.pick && pic) {
    const left = c.picAt + (+PREF.get("present.campic", 10) || 0) * 1000 - Date.now();
    if (left > 0) { mode = "pic"; c.timer = setTimeout(slideCamShow, left); }
  }
  c.mode = mode;
  deck.dataset.cam = mode;
  deck.classList.toggle("camwide", !!slide?.classList.contains("intro"));
  // Beside a slide with no picture place, its words make room.
  for (const n of deck.querySelectorAll(".slide")) n.classList.toggle("camside", n === slide && mode === "side" && !pics.length);
}
