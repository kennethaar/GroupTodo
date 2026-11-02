/* The names on offer are every name in every space on screen, because the
   handful can span spaces -- and a name is all that is written, so the page it
   stands for is made in whichever space the card itself lives in. */
const acrossNames = fn => {
  const set = new Set();
  acrossSpaces(() => { fn().forEach(n => set.add(n)); return []; });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};
const allOrgNames     = () => acrossNames(() => allPages(q => pageKind(q) === "org").map(baseName));
const allPersonNames  = () => acrossNames(() => allPeople().map(personName));
const allContextNames = () => acrossNames(() => contextList());
