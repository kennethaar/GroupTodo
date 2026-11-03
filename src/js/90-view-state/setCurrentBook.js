function setCurrentBook(path, {quiet = false} = {}) {
  if (path === bookPath()) return;
  PREF.set(curBookKey(), path);
  if (!quiet) { clearMemo(); render(); }
}
