/* The book shown: the one picked last on this device, or the first. */
function bookPath() {
  const all = bookPaths(), want = PREF.get(curBookKey(), "");
  return all.includes(want) ? want : all[0] || BOOK_PATH;
}
