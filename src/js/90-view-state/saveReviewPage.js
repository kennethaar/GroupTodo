function saveReviewPage(raw, medium) {
  const kindle = medium === "book" ? parseKindleNotes(raw) : null;
  const {name, path} = freePageName(DIRS.reviews, kindle ? kindle.title : pastedTitle(raw), "Review");
  const page = pageFromTemplate("r", name);
  page.props.medium = medium;
  if (kindle && kindle.by) page.props.by = kindle.by;
  page.blocks = kindle ? kindle.blocks : pastedBody(raw);
  putPage(path, page); touch(path);
  return {path, name, made: [path]};
}
