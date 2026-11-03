/* Every book, this area's first, in the areas' order and then the series'
   order: [{area, path, name}]. An area not opened this time is known from
   when it last was. */
function bookList() {
  let known = {};
  try { known = JSON.parse(PREF.get("bookList") || "{}") || {}; } catch (_) {}
  let changed = false;
  for (const n of new Set([V.space, ...LOADED.keys()])) {
    const books = inSpace(n, () => bookPaths().map(path => ({path, name: bookName(path)})));
    if (JSON.stringify(known[n] || []) === JSON.stringify(books)) continue;
    if (books.length) known[n] = books; else delete known[n];
    changed = true;
  }
  if (changed) PREF.set("bookList", JSON.stringify(known));
  const names = [V.space, ...Spaces.list.map(s => s.name).filter(n => n !== V.space)];
  return names.filter(n => Array.isArray(known[n])).flatMap(area => known[area].map(b => ({area, path: b.path, name: b.name})));
}
