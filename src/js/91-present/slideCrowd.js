/* A slide holds up to 9 lines, but more than 5 crowd it (#433). On a page
   that is a talk -- presented before, or with a slide mark or token -- the
   outline marks each bullet past the 5th on one slide and says why. Gives a
   Map of line id to that warning; a plain list page gives none. */
function slideCrowd(path) {
  return memo("slideCrowd\u0000" + V.space + "\u0000" + path, () => {
    const out = new Map();
    if (!getPage(path)) return out;
    const {slides} = deckSteps(path);
    // A chart guessed from numbers alone makes no talk; a chart's points are no bullets (#482).
    if (!slidePresented(path) && slides.every(s => s.layout === "list" || s.guess)) return out;
    for (const s of slides) if (!SLIDE_CHARTS.includes(s.layout)) s.kids.forEach((b, i) => {
      if (i >= SLIDE_CALM) out.set(b.id, `${i + 1} of ${s.kids.length} bullets on one slide. Keep a slide to ${SLIDE_CALM}.`);
    });
    return out;
  });
}
