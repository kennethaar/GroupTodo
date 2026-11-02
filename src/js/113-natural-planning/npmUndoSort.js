function npmUndoSort() {
  const l = NPM.last.pop();
  if (!l) return;
  const idea = NPM.ideas.find(i => i.id === l.id);
  if (idea) idea.to = null;
  if (l.made && !NPM.ideas.some(i => i.to === "c:" + l.made)) NPM.comps = NPM.comps.filter(c => c.id !== l.made);
  // Back on top of the pile, where it was.
  if (idea) NPM.ideas = [idea, ...NPM.ideas.filter(i => i !== idea)];
  NPM.naming = false;
  npmSave(); render();
}
