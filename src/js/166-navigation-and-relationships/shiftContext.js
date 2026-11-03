/* A context to another folder, with its links and the contexts inside it,
   and Undo to put it back. One by that name there already is merged into. */
function shiftContext(from, to, said) {
  if (to === from) return;
  const taken = V.pages.has(to) ? to : allPages(p => p !== from && p.toLowerCase() === to.toLowerCase())[0];
  if (taken) { mergeContextInto(ctxNameOf(from), ctxNameOf(taken)); return; }
  // Its title is its full name, the way Logseq writes a namespace: home/kitchen.
  const move = (a, b) => {
    const ref = pageRef(a);
    if (!moveFile(a, b)) return;
    moveChildrenOf(a, b, ref);
    if (getPage(b)) { getPage(b).props.title = b.slice(DIRS.contexts.length + 1).replace(/\.md$/i, ""); touch(b); }
    syncCtxChildren(ctxParentPath(a)); syncCtxChildren(ctxParentPath(b));
  };
  move(from, to);
  const space = V.space;
  pushUndo({run: () => { if (V.space !== space || !V.pages.has(to)) return false; move(to, from); render(); return true; }});
  notify(said(to));
}
