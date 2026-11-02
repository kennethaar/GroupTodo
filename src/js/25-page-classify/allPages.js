function allPages(filter) {
  const out = [];
  for (const path of V.pages.keys()) if (!filter || filter(path)) out.push(path);
  return out.sort();
}
