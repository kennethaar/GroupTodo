/* The block itself, or its nearest ancestor, linking to a project page:
   [[1/Fix sink]], or just [[Fix sink]] when that names a project (#362). */
function nearestProjectAncestor(block) {
  let p = block;
  while (p) {
    const m = /\[\[([_0123])\/([^\]]+)\]\]/.exec(p.title || "");
    if (m) return {statusDir: m[1], title: trim(m[2]), ref: m[1] + "/" + trim(m[2])};
    for (const ref of linksIn(p.title || "")) {
      if (ref.includes("/")) continue;               // p/, o/, c/ and the rest are never projects
      const tp = findExistingPage(ref);
      const sd = tp && pageKind(tp) === "project" ? statusDirOf(tp) : null;
      if (sd && "_0123".includes(sd)) return {statusDir: sd, title: pageTitle(tp), ref: sd + "/" + pageTitle(tp)};
    }
    p = p._parent;
  }
  return null;
}
