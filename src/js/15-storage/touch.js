/* An edit, carried to every copy of it: lines synced into other files or
   spaces first, then the page itself, then synced copies of the whole page. */
function touch(path) {
  syncBranchCopies(path);
  touchHere(path);
  syncPageCopies(path, V.space);
  if (typeof noteLocalEdit === "function") noteLocalEdit(path);
}
