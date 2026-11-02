/* Take the picked lines out, remembering exactly where each of them was so one
   ctrl-z puts the whole handful back where it came from. */
function lineSelRemove(word) {
  const got = lineSelBlocks();
  if (!got) { lineSelClear(); return null; }
  const path = LINE_SEL.path;
  const {page, blocks} = got;
  const spots = blocks.map(b => { const sibs = siblingsOf(page, b); return {sibs, i: sibs.indexOf(b), b}; });
  // Last first, so an earlier line's index is still the index it was.
  spots.slice().reverse().forEach(s => { if (s.i >= 0) s.sibs.splice(s.i, 1); });
  let filler = null;
  if (!page.blocks.length) { filler = newBlock({title: ""}); page.blocks.push(filler); }
  touch(path); noteTodoTouched();
  lineSelClear();
  render();
  if (word) notify(spots.length + (spots.length === 1 ? " line " : " lines ") + word + ".");
  pushUndo({run: () => {
    if (filler) { const i = page.blocks.indexOf(filler); if (i >= 0) page.blocks.splice(i, 1); }
    spots.forEach(s => { if (s.i >= 0) s.sibs.splice(s.i, 0, s.b); });
    touch(path); render();
    notify(spots.length === 1 ? "Line put back." : spots.length + " lines put back.");
    return true;
  }});
  return {spots, page, path};
}
