/* A line's context, or the nearest one above it. Writing
     - [[c/phone]]
       - TODO Ring the plumber
       - TODO Chase the quote
   puts both calls @phone without repeating the link on every line, the same
   way a [[1/project]] above a line files it. Own link first: a line that says
   where it is done overrides the heading it sits under. The parent pointer is
   set by flattenBlocks, which every list goes through. */
function blockContext(b) {
  for (let p = b; p; p = p._parent) {
    const c = contextOf(p.title);
    if (c) return c;
  }
  return null;
}
