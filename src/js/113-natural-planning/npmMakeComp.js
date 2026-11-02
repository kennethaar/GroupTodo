function npmMakeComp(name) {
  const idea = npmUnsorted()[0];
  name = npmNum(name);
  if (!idea || !name || NPM.comps.length >= NPM_COMP_KEYS.length) return;
  const c = {id: uid(), name, after: null, keep: [], act: {}};
  NPM.comps.push(c);
  idea.to = "c:" + c.id;
  NPM.last.push({id: idea.id, made: c.id});
  NPM.naming = false;
  npmSave(); render();
}
