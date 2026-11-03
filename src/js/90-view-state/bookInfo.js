function bookInfo(book = bookPath()) {
  const p = bookProps(book), name = oneLine(p.title);
  return {name: name.toLowerCase() === "book" ? "" : name, subtitle: oneLine(p.subtitle), synopsis: oneLine(p.synopsis)};
}
