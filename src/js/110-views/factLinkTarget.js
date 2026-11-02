/* The value a prop points at, when it points at a page. Lets "go to it" be the
   first row of the menu for area:: and for anything else somebody linked. */
function factLinkTarget(v) {
  const first = linksIn(String(v || ""))[0];
  if (!first) return null;
  return trim(String(first).split("][")[0]) || null;
}
