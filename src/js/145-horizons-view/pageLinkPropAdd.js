/* Appends a [[link]] to one of a page's own key:: value lines -- which is
   where the page's facts already live, and so where the pill for it turns up
   without anything else being taught about it. */
function pageLinkPropAdd(path, key, ref, opts = {}) {
  const page = getPage(path);
  if (!page) return null;
  const prev = page.props[key];
  const have = linksIn(prev || "").map(t => trim(String(t).split("][")[0]).toLowerCase());
  if (have.includes(ref.toLowerCase())) return null;
  // key:: none said there was nobody; somebody added takes its place (#377).
  const empty = !trim(prev || "") || trim(prev).toLowerCase() === NOTHING_FIRST;
  page.props[key] = (opts.single || empty) ? "[[" + ref + "]]"
                                                       : trim(prev) + ", [[" + ref + "]]";
  createLinkedPages("[[" + ref + "]]");
  touch(path);
  return () => {
    const pg = getPage(path);
    if (!pg) return;
    if (prev == null) delete pg.props[key]; else pg.props[key] = prev;
    touch(path);
  };
}
