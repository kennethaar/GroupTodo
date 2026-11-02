/* Every match in the area, best read first: day pages newest first, then the
   rest by name, each in the order it is written. `skip` is the line holding
   the query, which is never one of its own answers. */
function runQuery(src, skip = null) {
  return memo("query\u0000" + (V.space || "") + "\u0000" + src + "\u0000" + (skip ? skip.id : ""), () => {
    // A query that asks for nothing would otherwise match every line there is.
    if (!trim(src)) return {pages: false, rows: []};
    QUERY_REFS = new Map(); QUERY_LINKS = new Map();
    try { return queryAll(src, skip); } finally { QUERY_REFS = QUERY_LINKS = null; }
  });
}
