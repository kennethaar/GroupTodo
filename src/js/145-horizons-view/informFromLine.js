/* /inform, Alt+U and the side panel start here: from a line, to whoever it
   is about. The people it names; else whoever its project is with::, or its
   organisation; else a search, and the one you pick is linked on the line so
   the next update goes straight through. */
function informFromLine(path, block, space = V.space) {
  if (!whoAmI()) { notify("Put your name in first - the update has to say who it is from.", "warn"); return; }
  const start = {path, block, space};
  const people = inSpace(space, () => linePeople(block));
  const go1 = to => openSendUpdate(to, start);
  if (people.length === 1) { go1({name: people[0]}); return; }
  if (people.length > 1) {
    listPicker({title: "Send an update to", items: people, typeahead: true, label: n => n, onPick: n => go1({name: n})});
    return;
  }
  const org = inSpace(space, () => lineOrg(block));
  const proj = inSpace(space, () => lineProject(path, block));
  const r = proj && proj.path ? {space, path: proj.path} : null;
  const near = [...(org ? [{name: org, org: true}] : []),
    ...(r ? projectPeople(r).filter(n => !samePerson(n, whoAmI())).map(name => ({name})) : []),
    ...(r ? projectClients(r).filter(o => o.toLowerCase() !== (org || "").toLowerCase()).map(name => ({name, org: true})) : [])];
  const link = to => {
    const u = blockLinkAdd({space, path, block}, (to.org ? "o/" : "p/") + to.name);
    if (u) render();
    go1(to);
  };
  if (near.length === 1) { go1(near[0]); return; }
  if (near.length) {
    listPicker({title: "Send an update to", items: [...near, {search: true}], typeahead: true,
      label: t => t.search ? "Somebody else…" : (t.org ? "\u{1F3E2} " : "") + t.name,
      detail: t => t.search ? "people and organisations" : t.org ? "organisation" : "with:: on " + proj.title,
      onPick: t => t.search ? pickInformTarget(link) : go1(t)});
    return;
  }
  pickInformTarget(link);
}
