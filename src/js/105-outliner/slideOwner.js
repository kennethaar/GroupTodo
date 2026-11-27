/* The line whose layout word draws these lines (#481): the line they are
   all the lines of. Null for a page's top lines or only some of a line's. */
function slideOwner(path, lines) {
  const page = getPage(path);
  if (!page || !lines.length) return null;
  const par = parentOf(page, lines[0]), kids = par?.children || [];
  return par && kids.length === lines.length && lines.every(k => kids.includes(k)) ? par : null;
}
