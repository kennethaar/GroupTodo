function npmSortTake(to) {
  const idea = npmUnsorted()[0];
  if (!idea) return;
  if (to === "new") { NPM.naming = true; render(); return; }
  idea.to = to;
  NPM.last.push({id: idea.id});
  npmSave(); render();
}
