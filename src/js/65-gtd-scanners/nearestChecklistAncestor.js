/* The checklist a line came from. Running a list into a day drops its steps
   under one parent carrying [[8/<list>]], so the ancestor walk finds it from any
   step. A copy of a list is not loose thinking somebody failed to file: it was
   filed once, in the list, and it gets ticked off and forgotten. So these count
   as actions you can do, but never as journal actions to refile -- only applying
   a list to a project makes its steps project actions. */
function nearestChecklistAncestor(block) {
  let p = block;
  while (p) {
    const m = /\[\[8\/([^\]|#]+)/.exec(p.title || "");
    if (m) return {title: trim(m[1]), ref: "8/" + trim(m[1])};
    p = p._parent;
  }
  return null;
}
