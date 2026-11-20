/* The page as one walk (#431): the title first, then each top line as a
   slide. A slide shows its title, then its lines one step at a time; a line
   with lines of its own is not shown as a bullet first: → goes straight into
   its slide, and after it the bullet is in its place, done. So → is always
   just "next", in the order the outline is written.
   From one bullet (☰ › Present from here), that bullet is the title slide and
   its lines are the top slides. With `on`, each bullet after it at its level
   follows as a slide of its own; the ones before it stay out.
   Slide layouts (#433): each slide is drawn as slideLayout says. Top lines
   with no lines of their own are bullets on the title slide. A layout with
   more lines than fit goes on as "Title (2/2)". In a 2D layout (versus,
   2×2, scorecard, cards, quote) a line's own lines are drawn in its box, so
   only their own lines get a slide; `breadcrumb` says where a slide is from.
   `parts` are what → lights, one each: the lines, or a quote's takeaways.
   A task line or a "_ " line is left out with its lines (#467); `hidden`
   counts them for the presenter. The bullet you present from always shows.
   `pics` are the parts' own notepad pictures, shown while each is lit (#464). */
function deckSteps(path, root = null, on = false) {
  const page = getPage(path);
  const steps = [], slides = [], left = new Set();
  const words = b => !!(slideWords(b) || (b.children || []).some(words));
  const shown = b => {
    if (!words(b)) return false;
    if (slideHidden(b)) { left.add(b); return false; }
    return true;
  };
  const kidsOf = b => (b.children || []).filter(shown);
  const has = b => kidsOf(b).length > 0;
  const slide = (block, head, kids, depth, up, breadcrumb, notes) => {
    const lay = slideLayout({title: head}, kids);
    const pages = slidePages(kids, lay.max);
    pages.forEach((chunk, p) => {
      const hero = lay.layout === "hero" ? slideHero(chunk[0]) : null;
      const s = {n: slides.length + 1, block, depth, up, breadcrumb, kids: chunk,
        title: lay.title + (pages.length > 1 ? ` (${p + 1}/${pages.length})` : ""),
        layout: lay.layout, mode: lay.mode, axes: lay.axes, hero,
        parts: hero ? [chunk[0], ...hero.takeaways] : chunk, first: steps.length,
        ...(notes || (block ? slideNotes(block) : {cover: "", notes: ""}))};
      // A part's own notepad picture is shown in the cover's place while that part is lit (#464).
      s.pics = s.parts.map(p => p && typeof p === "object" ? slideNotes(p).cover : "");
      slides.push(s);
      steps.push({s, k: 0});
      s.parts.forEach((part, i) => {
        if (lay.mode === "1d" && has(part)) return slide(part, slideWords(part), kidsOf(part), depth + 1, s, lay.title);
        steps.push({s, k: i + 1});
        if (lay.mode === "1d") return;
        const crumb = lay.title + " > " + slideWords(hero ? chunk[0] : part);
        for (const l2 of hero ? (i ? [part] : []) : kidsOf(part))
          if (has(l2)) slide(l2, slideWords(l2), kidsOf(l2), depth + 1, s, crumb);
      });
      s.end = steps.length;
    });
  };
  const head = root ? slideWords(root) : pageTitle(path);
  const top = ((root ? root.children : page?.blocks) || []).filter(shown);
  // A top that is one 2D slide (versus, 2×2…) stays whole; else its plain lines head the talk.
  const whole = slideLayout({title: head}, top).mode === "2d";
  const notes = root ? slideNotes(root) : null;
  slide(null, head, whole ? top : top.filter(b => !has(b)), 0, null, "", notes);
  if (!whole) for (const b of top.filter(has)) slide(b, slideWords(b), kidsOf(b), 0, null, "");
  if (root && on) {
    const sibs = root._parent ? root._parent.children : page?.blocks || [];
    for (const b of sibs.slice(sibs.indexOf(root) + 1).filter(shown)) slide(b, slideWords(b), kidsOf(b), 0, null, "");
  }
  return {steps, slides, hidden: left.size};
}
