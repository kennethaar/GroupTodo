// The talk starts at hhmm (#486): kept on the page as starts::, and the waiting screen opens.
function presentWaitSet(path, hhmm) {
  const page = getPage(path);
  if (!page) return;
  closeModal();
  page.props = page.props || {};
  if (page.props.starts !== hhmm) { page.props.starts = hhmm; touch(path); }
  presentStart(path, {wait: true});
}
