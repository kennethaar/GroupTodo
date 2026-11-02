/* The parsed lines, ready to go into a page: a line that carries no state of
   its own becomes whatever the place it is going says an unmarked line is, a
   task gets today's date, your name and the context in force, and the pages
   its [[links]] point at come into being. The helpers it leans on are defined
   further down; nothing calls this before they are.  */
function readyPastedBlocks(roots, opts = {}) {
  let n = 0;
  const taken = new Set();
  for (const [, page] of V.pages)
    walkBlocks(page.blocks, b => { const id = trim(blockProp(b, "id") || ""); if (id) taken.add(id); });
  walkBlocks(roots, (b, parent) => {
    n++;
    /* In a copied outline the lines already say what they are: a note under a
       task stays a note. Loose text is a list of tasks. The capture box asks
       for its top lines to be tasks either way. */
    const wantsDefault = !roots.outline || (opts.outlineRoots && !parent);
    if (!b.state && opts.defaultState && wantsDefault) b.state = opts.defaultState;
    if (b.state) b.title = dotsToEst(b.title);
    if (b.state && opts.context && !hasContextLink(b.title))
      b.title = trim(b.title + " [[c/" + opts.context + "]]");
    // A copy of a line that still exists must not take its id:: -- links to
    // that line would start landing on this one. After a cut it is free.
    const id = trim(blockProp(b, "id") || "");
    if (id && taken.has(id)) {
      for (const k of Object.keys(b.props)) if (k.toLowerCase() === "id") delete b.props[k];
    } else if (id) taken.add(id);
    // A task copied out of the app brings its template's fields along with it.
    if (b.state && !Object.keys(b.props || {}).length) { applyTodoTemplate(b); }
    if (b.title) createLinkedPages(b.title);
  });
  // Typed into capture, a line's date is in its words; pasted into a page, it is only text.
  if (opts.when) roots.when = readWhenInto(roots);
  return n;
}
