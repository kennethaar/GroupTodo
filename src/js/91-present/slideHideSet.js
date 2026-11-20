/* Hide in Present / Show in Present (#467) on some lines of one page: when
   every one is hidden already, the "_ " comes off them all; else the ones
   still shown get it. A task line is left as it is: it is off the slides
   already. One Ctrl+Z takes the whole pick back, then runs back() if given. */
function slideHideSet(path, lines, back) {
  const page = getPage(path);
  const own = lines.filter(b => !b.state);
  if (!page || !own.length) return;
  const show = own.every(b => /^_\s/.test(b.title || ""));
  const snapshot = structuredClone(page), space = V.space;
  for (const b of own) b.title = show ? (b.title || "").replace(/^_\s+/, "") : /^_\s/.test(b.title || "") ? b.title : "_ " + (b.title || "");
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render(); if (back) back();
    return true;
  }});
  touch(path); render();
}
