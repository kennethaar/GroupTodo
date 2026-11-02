function removePage(path) {
  V.pages.delete(path);
  V.dirty.delete(path);
  V.removed.add(path);
  addTombstone(path);
  scheduleFlush();
}
