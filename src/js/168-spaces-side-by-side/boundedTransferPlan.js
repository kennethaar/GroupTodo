/* What moving a page drags along: the page, any pages it links to that you
   tick, and the journal lines that point straight at it (with their children).
   Links are followed one step only, so one page does not pull in the vault. */
function boundedTransferPlan(path, space) {
  return inSpace(space, () => {
    const page = getPage(path);
    if (!page) return {path, space, files: [], projects: [], branches: []};
    /* A responsibility's projects point at it, not it at them, so they are
       found the other way round and offered on their own. */
    const projects = pageKind(path) === "area" ? projectsInArea(baseName(path)) : [];
    const files = [...pageReferenceTargets(page)].filter(p => p !== path && !isJournalPath(p) && !projects.includes(p));
    const branches = [];
    for (const [journal, p] of V.pages) {
      if (!isJournalPath(journal)) continue;
      const scan = blocks => {
        for (const block of blocks || []) {
          // This line's own text, properties and body -- not its children's.
          const own = {props: {}, blocks: [{...block, children: []}]};
          if (pageReferenceTargets(own).has(path)) branches.push({space, path: journal, id: block.id, title: block.title});
          else scan(block.children);
        }
      };
      scan(p.blocks);
    }
    return {path, space, files, projects, branches};
  });
}
