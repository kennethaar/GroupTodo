/* ---------- a page's views (#420) ----------
   Any page can be seen another way than as its outline, in a tab beside it.
   The tabs a page has are written on it as views:: parts, read, so they go
   with the page; the tabs say it, never a line of values. A view is offered
   only while it can work with what the page holds. Book's own views are the
   Write a book template's; these are for every page. */
const PAGE_VIEWS_PROP = "views";
const PAGE_VIEWS = [
  {id: "parts", label: "Parts", what: "the pages it links to, in order, and how far each is",
   works: path => pageParts(path).length >= 2, draw: (c, path) => viewPageParts(c, path)},
  {id: "read", label: "Read", what: "all its parts as one text, to read through",
   works: path => pageParts(path).length >= 2, draw: (c, path) => viewPageRead(c, path)},
];
const pageViews = path => String(getPage(path)?.props?.[PAGE_VIEWS_PROP] || "").split(",").map(trim)
  .filter((id, i, all) => PAGE_VIEWS.some(v => v.id === id) && all.indexOf(id) === i);
const pageViewsThatWork = path => PAGE_VIEWS.filter(v => v.works(path)).map(v => v.id);
const pageViewKey = path => "pageview:" + (V.space || "") + ":" + path;
/* The tab shown: the one picked last, while the page still has it. */
const pageViewNow = path => { const id = PREF.get(pageViewKey(path), ""); return pageViews(path).includes(id) ? id : "outline"; };
