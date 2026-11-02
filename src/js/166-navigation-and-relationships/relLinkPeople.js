/* A person dropped on an organisation (or the other way round) works there:
   both pages say so, so either one lists the other. */
function relLinkPeople(a, b) {
  if (a.space !== b.space) { notify("Use pages in the same area.", "warn"); return; }
  const undo = [];
  inSpace(a.space, () => {
    const person = relKind(a) === "person" ? a : b, org = person === a ? b : a;
    const u = pageLinkPropAdd(person.path, "organisation", pageRef(org.path));
    if (u) undo.push(u);
    const v = pageLinkPropAdd(org.path, "people", pageRef(person.path));
    if (v) undo.push(v);
  });
  if (undo.length) pushUndo({run: () => {
    inSpace(a.space, () => undo.reverse().forEach(fn => fn()));
    render();
    return true;
  }});
  render();
  notify("Person and organisation linked in both directions.");
}
