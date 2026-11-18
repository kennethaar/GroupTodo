/* The page as one walk (#431): the title first, then each top line as a
   slide. A slide shows its title, then its lines one step at a time; a line
   with lines of its own is not shown as a bullet first: → goes straight into
   its slide, and after it the bullet is in its place, done. So → is always
   just "next", in the order the outline is written.
   From one bullet (☰ › Present from here), that bullet is the title slide and
   its lines are the top slides, so a day page shows that talk and no more. */
function deckSteps(path, root = null) {
  const page = getPage(path);
  const steps = [], slides = [];
  const shown = b => !!(slideWords(b) || (b.children || []).some(shown));
  const slide = (block, title, depth, notes) => {
    const kids = block ? (block.children || []).filter(shown) : [];
    const s = {n: slides.length + 1, block, title, depth, kids, first: steps.length,
      ...(notes || (block ? slideNotes(block) : {cover: "", notes: ""}))};
    slides.push(s);
    steps.push({s, k: 0});
    kids.forEach((kid, i) => {
      if ((kid.children || []).some(shown)) slide(kid, slideWords(kid), depth + 1);
      else steps.push({s, k: i + 1});
    });
    s.end = steps.length;
  };
  slide(null, root ? slideWords(root) : pageTitle(path), 0, root ? slideNotes(root) : null);
  for (const b of ((root ? root.children : page?.blocks) || []).filter(shown)) slide(b, slideWords(b), 0);
  return {steps, slides};
}
