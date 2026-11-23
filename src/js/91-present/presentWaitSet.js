/* The talk starts at hhmm (#486): kept on the page as starts::, and the
   waiting screen opens. A talk of this page already running turns to it in
   place, so the presenter window stays (#489). */
function presentWaitSet(path, hhmm) {
  const page = getPage(path);
  if (!page) return;
  closeModal();
  page.props = page.props || {};
  if (page.props.starts !== hhmm) { page.props.starts = hhmm; touch(path); }
  if (DECK && DECK.path === path) { DECK.pwTimes = false; slideWaitBegin(); }
  else presentStart(path, {wait: true});
}
