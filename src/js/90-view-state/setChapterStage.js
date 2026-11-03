function setChapterStage(path, name) {
  const page = getPage(path);
  if (!page) return;
  // The chapter as it was at the end of a stage is kept (#254).
  const was = chapterStage(path).name;
  if (was.toLowerCase() !== String(name).toLowerCase() && chapterWords(path)) snapshotChapter(path, was);
  page.props = page.props || {};
  page.props.stage = name;
  touch(path);
  render();
}
