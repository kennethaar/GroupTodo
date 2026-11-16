/* Writes the page's tabs; none takes the line off. */
function setPageViews(path, ids) {
  const page = getPage(path); if (!page) return;
  if (ids.length) page.props[PAGE_VIEWS_PROP] = ids.join(", ");
  else delete page.props[PAGE_VIEWS_PROP];
  touch(path);
  clearMemo();
  render();
}
