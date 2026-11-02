/* ---------- the questions ---------- */
const npmComp = id => NPM.comps.find(c => c.id === id);
const npmUnsorted = () => NPM.ideas.filter(i => !i.to);
