function setChapterStage(path, name) {
  const page = getPage(path);
  if (!page) return;
  page.props = page.props || {};
  page.props.stage = name;
  touch(path);
  render();
}
