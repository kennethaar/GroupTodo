/* What is in the clipboard takes the picked lines' place -- same parsing the
   paste into a single line already does, so an indented list arrives
   indented. */
function lineSelPaste(raw) {
  const got = lineSelBlocks();
  if (!got) { lineSelClear(); return; }
  const roots = parseOutlineText(raw);
  if (!roots.length) return;
  const path = LINE_SEL.path;
  const {page, blocks} = got;
  const first = blocks[0];
  const sibs = siblingsOf(page, first);
  const at = sibs.indexOf(first);
  const n = readyPastedBlocks(roots, {});
  const spots = blocks.map(b => { const list = siblingsOf(page, b); return {list, i: list.indexOf(b), b}; });
  spots.slice().reverse().forEach(s => { if (s.i >= 0) s.list.splice(s.i, 1); });
  sibs.splice(Math.max(0, Math.min(at, sibs.length)), 0, ...roots);
  touch(path); noteTodoTouched();
  lineSelClear();
  render();
  const said = n + (n === 1 ? " line pasted" : " lines pasted") + " over " + spots.length +
    (spots.length === 1 ? " line." : " lines.");
  if (n < PASTE_AS_LINES) notify(said);
  else offerPasteAs(raw, said + " Make a page of them instead:", pasteSwapper(path, roots, (kind, link) => newBlock({title: link}, false)));
  pushUndo({run: () => {
    roots.forEach(r => { const i = sibs.indexOf(r); if (i >= 0) sibs.splice(i, 1); });
    spots.forEach(s => { if (s.i >= 0) s.list.splice(s.i, 0, s.b); });
    touch(path); render();
    notify("Put back.");
    return true;
  }});
}
