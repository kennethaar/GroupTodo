/* ---------- where this todo sits ----------
   A todo in a list is a line with no surroundings: you cannot see what it
   belongs to, what comes with it, or what hangs off it without leaving and
   coming back. This is the same few facts the file already holds, placed rather
   than listed, so the shape is read in one look:

       tags          project
       (context       parent
        first)        THE TODO        siblings
                    children

   Three columns, four rows, every cell a way in. Nothing here is computed or
   stored: the project is the page the line lives on, the parent and siblings
   and children are the indentation, and the tags are the [[links]] in the
   title. */
/* Every project link above a todo, nearest first, all the way to the top of
   the page. Indentation is inheritance here: a line under a project link
   belongs to that project however deep it sits, and a project link indented
   under another project link is a milestone inside it, which is how a plan with
   stages gets written in a file that has no idea what a stage is:

     - [[1/Rewire the workshop]]
       - [[1/First fix]]
         - TODO Pull the cable
       - [[1/Second fix]]
         - TODO Dress the board

   So the nearest one answers "what is this part of", and the ones above it are
   the plan it is part of. Both are kept, in that order. */
function projectChainOf(page, block) {
  const chain = [], seen = new Set();
  let b = block;
  while (b) {
    for (const raw of linksIn(b.title)) {
      const r = trim(String(raw).split("][")[0]);
      const pfx = (/^([^/]+)\//.exec(r) || [])[1];
      if (!pfx || !STATUS_DIRS[pfx] || seen.has(r.toLowerCase())) continue;
      seen.add(r.toLowerCase());
      chain.push(r);
    }
    b = parentOf(page, b);
  }
  return chain;
}
