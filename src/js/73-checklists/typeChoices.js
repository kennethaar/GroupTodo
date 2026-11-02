/* A type is a page in one area, but it is offered for tasks in every visible
   area, {path, space} each: one per name, this area's own first. */
function typeChoices() {
  const out = stateLists().map(path => ({path, space: V.space}));
  const names = new Set(out.map(t => baseName(t.path).toLowerCase()));
  for (const t of acrossSpaces(() => stateLists().map(path => ({path})))) {
    if (!t.space || t.space === V.space || names.has(baseName(t.path).toLowerCase())) continue;
    names.add(baseName(t.path).toLowerCase());
    out.push(t);
  }
  return out;
}
