function clearAvatar(name) {
  const path = personPath(name);
  if (!V.pages.has(path)) return;
  const page = getPage(path);
  delete page.props[AVATAR_PROP];
  putPage(path, page);
  render();
}
