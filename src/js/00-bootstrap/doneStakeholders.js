/* Who to tell that something is done (#402). A project: stakeholdersOf. A
   task: the people and organisations named on its line, then the project's. */
function doneStakeholders(e) {
  const t = doneTarget(e);
  if (!t) return [];
  if (e.kind === "project") return stakeholdersOf(e.space, t.path);
  return inSpace(e.space, () => {
    const out = [
      ...linePeople(t.block).map(name => ({name, email: emailOf(name, e.space)})),
      ...linksIn(t.block.title).map(l => trim(l.split("][")[0])).filter(l => /^o\//i.test(l))
        .map(l => trim(l.slice(2))).map(name => ({name, org: true, email: orgProp(name, EMAIL_PROP)})),
    ];
    const proj = lineProject(t.path, t.block);
    for (const s of proj && proj.path ? stakeholdersOf(e.space, proj.path) : [])
      if (!out.some(x => sameStake(x, s))) out.push(s);
    return out.filter((x, i) => out.findIndex(y => sameStake(x, y)) === i);
  });
}
