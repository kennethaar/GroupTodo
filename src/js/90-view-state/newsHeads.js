/* The names of what is new, for a toast: the heads, else the opening words. */
function newsHeads(entries) {
  return entries.flatMap(e => e.items).map(x => x.head || x.text.replace(/^(.{0,50}\S*).*$/, "$1…"));
}
