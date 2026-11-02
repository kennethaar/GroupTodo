/* Swaps the lines for one line that links the page made of them, and hands
   back what puts the lines back. lineFor(kind, link) makes the line. */
function pasteSwapper(path, roots, lineFor) {
  return (kind, link) => {
    const page = getPage(path);
    const taken = new Set();
    const spots = page ? roots.map(r => { const s = findOnPage(page, r, taken); if (s) taken.add(s.b); return s; }) : [];
    if (!spots.length || spots.some(s => !s)) return null;
    const gone = spots.map(s => s.b);
    const line = lineFor(kind, link);
    spots[0].list.splice(spots[0].i, 0, line);
    for (const b of gone) removeBlockFrom(page, b);
    touch(path); noteTodoTouched(); render();
    return () => {
      const now = getPage(path), at = now && findOnPage(now, line);
      if (!at) return false;
      at.list.splice(at.i, 1, ...gone);
      touch(path); noteTodoTouched(); render();
      return true;
    };
  };
}
