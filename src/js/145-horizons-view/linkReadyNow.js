/* The page a link names is in, read and no stand-in, with the line if it names one. */
function linkReadyNow(link) {
  const rec = LOADED.get(V.space);
  const page = V.pages.has(link.path) && !(rec && stillLoading(rec, link.path));
  return page && (!link.block || !!linkedBlock(link));
}
