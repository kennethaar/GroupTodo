/* The page as one walk (#431): the title first, then each top line as a
   slide. A slide shows its title, then its lines one step at a time; a line
   with lines of its own leads down into a slide of them before the next
   bullet. So → is always just "next", in the order the outline is written. */
function deckSteps(path) {
  const page = getPage(path);
  const steps = [], slides = [];
  const shown = b => !!(slideWords(b) || (b.children || []).some(shown));
  const slide = (block, title, depth) => {
    const kids = block ? (block.children || []).filter(shown) : [];
    const s = {n: slides.length + 1, block, title, depth, kids, first: steps.length,
      ...(block ? slideNotes(block) : {cover: "", notes: ""})};
    slides.push(s);
    steps.push({s, k: 0});
    kids.forEach((kid, i) => {
      steps.push({s, k: i + 1});
      if ((kid.children || []).some(shown)) slide(kid, slideWords(kid), depth + 1);
    });
    s.end = steps.length;
  };
  slide(null, pageTitle(path), 0);
  for (const b of (page?.blocks || []).filter(shown)) slide(b, slideWords(b), 0);
  return {steps, slides};
}
