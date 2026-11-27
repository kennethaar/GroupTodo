/* The lines whose own lines carry old slide marks that draw them (#481),
   each with the layout word it gets: ["-> Q1", "-> Q2"] under Roadmap
   gives [Roadmap, "timeline"]. A line with a word already, or marks that
   draw nothing (too few lines), is left out. A page's top lines have no
   line above to take a word: their marks stay. */
function slideTidyLines(path) {
  const page = getPage(path), out = [];
  walkBlocks(page?.blocks || [], b => {
    const kids = b.children || [];
    if (!kids.length || slideWord(b.title).layout || !slideMarkOf(kids)) return;
    const lay = slideLayout({title: b.title}, kids).layout;
    if (lay !== "list" && lay !== "table") out.push([b, lay]);
  });
  return out;
}
