function setChapterSynopsis(path, text) {
  const page = getPage(path);
  if (!page) return;
  page.props = page.props || {};
  if (oneLine(text)) page.props.synopsis = oneLine(text); else delete page.props.synopsis;
  touch(path);
  render();
}
