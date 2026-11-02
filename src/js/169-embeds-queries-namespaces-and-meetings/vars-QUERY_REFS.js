/* Where a link points, the way the rest of the app resolves one: the page if
   there is one, else the words, so two spellings of a missing page still meet. */
/* A query asks the same few links of thousands of lines, so while one runs
   each spelling is looked up once. */
let QUERY_REFS = null;
const queryRefKey = ref => {
  const t = trim(String(ref || "").split("|")[0].split("#")[0]);
  if (QUERY_REFS && QUERY_REFS.has(t)) return QUERY_REFS.get(t);
  const key = findExistingPage(t) || "?" + t.toLowerCase();
  if (QUERY_REFS) QUERY_REFS.set(t, key);
  return key;
};
/* The lines that link to a page, from the index Linked References already
   keeps: a line counts when it, or a line above it, names the page. */
let QUERY_LINKS = null;
