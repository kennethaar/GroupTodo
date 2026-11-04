/* The refile targets a line links to, in the order the line names them, once
   each. A link to a person or a date is not a target, so it is left out. */
function refileLinked(fromPath, block) {
  const targets = new Set(refileTargets(fromPath));
  return [...new Set(linksIn(block?.title).map(findExistingPage))].filter(p => p && targets.has(p));
}
