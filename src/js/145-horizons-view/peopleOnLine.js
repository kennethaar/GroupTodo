/* The people a line names, or, when it names nobody, the ones the nearest
   line above it names: a task under [[p/Joe]] is about Joe as much as one
   with his name in it. Own names first, as with a context. */
function peopleOnLine(b) {
  for (let p = b; p; p = p._parent) {
    const names = peopleNamedIn(p.title);
    if (names.length) return names;
  }
  return [];
}
