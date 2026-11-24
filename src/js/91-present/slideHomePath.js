/* The page a line on a slide is written on (#470): the talk's own page, or
   the page an embedded line comes from. */
function slideHomePath(b, path) {
  let top = b;
  while (top?._parent) top = top._parent;
  if (getPage(path)?.blocks?.includes(top)) return path;
  for (const [p, page] of V.pages) if (page.blocks?.includes(top)) return p;
  return path;
}
