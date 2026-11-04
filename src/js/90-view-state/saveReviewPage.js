function saveReviewPage(raw, medium) {
  const {name, path} = freePageName(DIRS.reviews, pastedTitle(raw), "Review");
  const page = pageFromTemplate("r", name);
  page.props.medium = medium;
  page.blocks = pastedBody(raw);
  putPage(path, page); touch(path);
  return {path, name, made: [path]};
}
