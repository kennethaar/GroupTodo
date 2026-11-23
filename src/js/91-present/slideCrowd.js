/* A slide holds up to 9 lines, but more than 5 crowd it (#433). On a page
   that is a talk -- presented before, or with a slide mark or token -- the
   outline marks each bullet past the 5th on one slide and says why. Gives a
   Map of line id to that warning; a plain list page gives none. */
function slideCrowd(path) {
  return memo("slideCrowd\u0000" + V.space + "\u0000" + path, () => {
    const out = new Map();
    if (!getPage(path)) return out;
    /* A layout word whose lines break its rule, and a slide picture that is
       not in assets/slides/ (#483), are marked whatever else the page is. */
    const known = SLIDE_AI_KNOWN.get(V.space || "");
    walkBlocks(getPage(path).blocks, b => {
      const why = [], lay = slideWord(b.title).layout, n = (b.children || []).filter(c => !slideHidden(c)).length;
      if (lay === "quadrant" && n !== 4) why.push(`A 2×2 needs exactly 4 lines; this has ${n}.`);
      else if (lay && n && n < SLIDE_LAYOUTS[lay].min && SLIDE_LAYOUTS[lay].min >= 3)
        why.push(`A ${SLIDE_LAYOUTS[lay].name.toLowerCase()} needs ${SLIDE_LAYOUTS[lay].min} lines or more; this has ${n}.`);
      if (known) for (const line of [b.title, ...(b.body || [])]) for (const m of String(line || "").matchAll(SLIDE_AI_LINK_RE)) {
        const name = slideAiName(m[2]);
        if (!known.has(name)) why.push(`The picture "${name}" is not in ${SLIDE_AI_DIR}.`);
      }
      if (why.length) out.set(b.id, why.join(" "));
    });
    const {slides} = deckSteps(path);
    // A chart guessed from numbers alone makes no talk; a chart's points are no bullets (#482).
    if (!slidePresented(path) && slides.every(s => s.layout === "list" || s.guess)) return out;
    for (const s of slides) if (!SLIDE_CHARTS.includes(s.layout) && s.layout !== "map") s.kids.forEach((b, i) => {
      if (i >= SLIDE_CALM) out.set(b.id, `${i + 1} of ${s.kids.length} bullets on one slide. Keep a slide to ${SLIDE_CALM}.`);
    });
    return out;
  });
}
