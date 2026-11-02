function nsPlace(path) {
  if (!path.startsWith(PAGES + "/")) return null;
  const kinds = NS_KIND_DIRS();
  let rel = path.slice(PAGES.length + 1).replace(/\.md$/i, "").split("/");
  let base = PAGES;
  if (rel.length > 1 && kinds.has(join(PAGES, rel[0]))) { base = join(PAGES, rel[0]); rel = rel.slice(1); }
  else if (rel.length === 1 && kinds.has(join(PAGES, rel[0]))) return null;
  const last = rel.length === 1 && base === PAGES ? rel[0].split(" - ").map(trim).filter(Boolean) : [rel[rel.length - 1]];
  const segs = [...rel.slice(0, -1), ...last];
  return segs.length ? {base, segs} : null;
}
