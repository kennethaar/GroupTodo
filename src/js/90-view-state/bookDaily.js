function bookDaily(book = bookPath()) {
  const n = parseInt(String(bookProps(book).daily || "").replace(/[\s,.  ]/g, ""), 10);
  return n > 0 ? n : null;
}
