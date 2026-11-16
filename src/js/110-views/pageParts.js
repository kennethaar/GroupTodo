/* A page's parts (#420): its top lines that are only a link to a page made,
   in order, once each. A task or a line with words of its own is not one. */
function pageParts(path) {
  const out = [];
  for (const block of getPage(path)?.blocks || []) {
    if (block.state) continue;
    const m = /^\[\[([^\]]+)\]\]$/.exec(trim(block.title || ""));
    const to = m && findExistingPage(trim(m[1].split("][")[0]));
    if (to && to !== path && !out.some(p => p.path === to)) out.push({name: pageTitle(to), path: to, block});
  }
  return out;
}
