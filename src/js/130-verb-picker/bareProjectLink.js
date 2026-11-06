/* A capture line that is nothing but a link to its project -- the normal way
   to file a todo under one, per projectChainOf -- is scaffolding, not a task
   of its own (#309). Opening it should go to the project page the link
   already names, not to a task panel built for a line that has no words. */
function bareProjectLink(path, block) {
  const page = getPage(path);
  if (!page) return null;
  const chain = projectChainOf(page, block);
  if (!chain.length) return null;
  const ownRefs = linksIn(block.title).map(r => trim(r.split("][")[0])).filter(r => chain.includes(r));
  if (!ownRefs.length) return null;
  let left = linkWords(block.title);
  for (const ref of chain) left = left.replace(ref.replace(/^[^/]+\//, ""), "");
  if (trim(left)) return null;
  return findExistingPage(ownRefs[0]);
}
