function bookPage() {
  const path = bookPath();
  if (!getPage(path)) putPage(path, {props: {title: "book", created: todayStamp()}, blocks: []});
  return getPage(path);
}
