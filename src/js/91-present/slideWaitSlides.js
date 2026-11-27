/* The waiting slides (#486): each line under the page's "(waiting)" line, as
   a slide drawn like any other. None there: the page's title slide. */
function slideWaitSlides(path) {
  let wait = null;
  walkBlocks(getPage(path)?.blocks || [], b => { if (!wait && SLIDE_WAIT_RE.test(b.title || "")) wait = b; });
  const kids = (wait?.children || []).filter(c => !slideHidden(c));
  if (!kids.length) return deckSteps(path).slides.slice(0, 1);
  // Each line presented from itself: its slide, with its lines; `line` is where it came from.
  return kids.map(c => ({...deckSteps(path, c).slides[0], line: c}));
}
