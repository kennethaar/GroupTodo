/* {name, path, block, book} per chapter line; path is null for a page not made yet. */
function chaptersOf(book) {
  const out = [];
  for (const block of getPage(book)?.blocks || []) {
    const t = trim(block.title || "");
    const name = trim((/\[\[([^\]]+)\]\]/.exec(t) || [, t])[1].split("][")[0]);
    if (!name || out.some(c => c.name.toLowerCase() === name.toLowerCase())) continue;
    out.push({name, path: findExistingPage(name), block, book});
  }
  return out;
}
