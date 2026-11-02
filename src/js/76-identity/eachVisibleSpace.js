/* ---------- where somebody works ----------
   Two people can share a name and nothing else. Their pages cannot share a
   file name, so they are p/Anna Berg - Acme and p/Anna Berg - Northwind, and
   the organisation is what tells them apart wherever they turn up. Somebody
   works where their own page says (organisation:: [[o/Acme]]), where the
   organisation's page names them (people:: [[p/...]]), and where their page's
   name ends in an organisation that has a page -- "Anna Berg - Acme" or
   "Anna Berg (Acme)" -- which is how it was written before there was any
   other way, and keeps working without touching a file. */
function eachVisibleSpace(fn) {
  const names = visibleSpaces().filter(n => LOADED.has(n));
  if (!names.length) fn(); else for (const n of names) inSpace(n, fn);
}
