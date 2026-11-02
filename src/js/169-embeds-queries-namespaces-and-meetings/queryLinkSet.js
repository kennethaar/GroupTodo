function queryLinkSet(ref) {
  const t = trim(String(ref || "").split("|")[0].split("#")[0]);
  if (QUERY_LINKS && QUERY_LINKS.has(t)) return QUERY_LINKS.get(t);
  const path = findExistingPage(t);
  const names = path ? [pageRef(path).toLowerCase(), baseName(path).toLowerCase()] : [t.toLowerCase()];
  const {recs, by} = backlinkIndex();
  const set = new Set();
  for (const n of names) for (const i of by.get(n) || []) if (recs[i].block) set.add(recs[i].block);
  const out = {key: queryRefKey(t), set};
  if (QUERY_LINKS) QUERY_LINKS.set(t, out);
  return out;
}
