/* The responsibility a line belongs to. Not every action needs a project: a
   single action under an area of focus has been filed already, so it is no
   loose journal action to refile. */
function nearestAreaAncestor(block) {
  let p = block;
  while (p) {
    const m = /\[\[a\/([^\]]+)\]\]/.exec(p.title || "");
    if (m) return {title: trim(m[1]), ref: "a/" + trim(m[1])};
    p = p._parent;
  }
  return null;
}
