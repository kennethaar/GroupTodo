/* The block itself, or its nearest ancestor, linking to a project page: [[1/Fix sink]] */
function nearestProjectAncestor(block) {
  let p = block;
  while (p) {
    const m = /\[\[([_0123])\/([^\]]+)\]\]/.exec(p.title || "");
    if (m) return {statusDir: m[1], title: trim(m[2]), ref: m[1] + "/" + trim(m[2])};
    p = p._parent;
  }
  return null;
}
