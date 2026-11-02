function nestContext(parent, child) {
  if (parent.space !== child.space) { notify("Use contexts in the same area.", "warn"); return; }
  inSpace(parent.space, () => {
    const from = child.path, dir = parent.path.replace(/\.md$/i, "");
    if (from === parent.path || dir.startsWith(from.replace(/\.md$/i, "") + "/")) {
      notify("A context cannot go inside one of its own.", "warn"); return;
    }
    const to = dir + "/" + baseName(from) + ".md";
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
    notify(ctxName({path: to}) + " is now inside " + ctxName(parent) + ".");
  });
  render();
}
