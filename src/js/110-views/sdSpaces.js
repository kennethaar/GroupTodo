// The areas on screen that have someday projects, and how many.
function sdSpaces() {
  const by = new Map();
  for (const r of sdProjects()) by.set(r.space || "", (by.get(r.space || "") || 0) + 1);
  return by;
}
