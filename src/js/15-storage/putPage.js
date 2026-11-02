function putPage(path, page, {silent = false} = {}) {
  /* A page put in place of another remembers only the meetings it holds
     itself. Inheriting the old page's took every meeting a synced or merged
     copy did not have yet for one you had deleted, and cal_deleted:: then kept
     them all off the day for good. A page that remembers nothing yet (a merge,
     a clone) remembers what it holds, so the first delete on it still counts. */
  if (!page._cal && path.startsWith(JOURNALS + "/")) calRemember(page, calKeysOn(page));
  V.pages.set(path, page);
  V.removed.delete(path);
  if (!silent) { V.dirty.add(path); scheduleFlush(); }
  return page;
}
