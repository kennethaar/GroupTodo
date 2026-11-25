/* Show step i. On the same slide only the bullets change: the new one fades
   in and the ones before it step back. Another slide moves in: the next one
   comes up from below (down the talk), the one before from above. Into a
   bullet's own lines the bullet grows from its place into the title, and on
   the way back out the title shrinks into it again. */
function presentGo(i) {
  if (!DECK) return;
  // Moved on from the presenter window while a line was being edited (#466): the edit is dropped.
  if (DECK.edit) slideEditEnd(false);
  const {steps, deck} = DECK;
  i = Math.max(0, Math.min(steps.length - 1, i));
  const from = steps[DECK.i], to = steps[i];
  const fwd = !from || i >= DECK.i;
  DECK.i = i;
  // The last line shown, for the offer when the talk ends (#515); a title slide of the page has none.
  if (DECK.steps[i]?.k || DECK.steps[i]?.s.block) DECK.seen = DECK.steps[i];
  const old = deck.querySelector(".slide.cur");
  if (from && from.s === to.s && old) {
    slideBullets(old, to, fwd && to.k === from.k + 1);
  } else {
    /* From the page's title alone, the title rises to the top, into the
       next slide's breadcrumb, and stays there; the next slide comes in
       under it (#431). With no breadcrumb to land on it goes. */
    const rise = !!(old && from && !from.s.block && !from.k && fwd && old.classList.contains("intro"));
    const move = !from ? "" : to.s.up === from.s ? "zoomin" : from.s.up === to.s ? "zoomout" : rise ? "rise" : fwd ? "down" : "up";
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
    SLIDE_ARR_PICK = null;            // a pick is for the slide it was made on (#487)
    const slide = slideSection(to.s);
    deck.append(slide);
    resolveAssets(slide);
    slideBullets(slide, to, false);
    if (move === "rise" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const title = old.querySelector(".stitle");
      const crumb = slide.querySelector(".scrumb");
      const land = crumb && crumb.textContent === title.textContent ? crumb : null;
      let top;
      if (land) top = slideTitleNow(land);
      else {
        // The title's place at the top, measured on an unseen copy of its slide laid out.
        const probe = slideSection(from.s);
        probe.className = "slide";
        probe.style.visibility = "hidden";
        deck.append(probe);
        top = slideTitleNow(probe.querySelector(".stitle"));
        probe.remove();
      }
      if (slideGhost(deck, slideTitleNow(title), top, land)) title.style.visibility = "hidden";
    }
    if (move === "zoomin" && slot) slideZoom(slide.querySelector(".stitle"), slot, true);
    if (move === "zoomout" && old) slideZoom(old.querySelector(".stitle"), spot(slide, from.s.block), false);
  }
  slideCamShow();      // the camera follows the slide (#485)
  presenterDraw();
}
