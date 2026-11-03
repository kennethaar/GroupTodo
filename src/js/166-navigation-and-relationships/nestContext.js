function nestContext(parent, child) {
  if (parent.space !== child.space) { notify("Use contexts in the same area.", "warn"); return; }
  inSpace(parent.space, () => {
    const from = child.path, dir = parent.path.replace(/\.md$/i, "");
    if (from === parent.path || dir.startsWith(from.replace(/\.md$/i, "") + "/")) {
      notify("A context cannot go inside one of its own.", "warn"); return;
    }
    shiftContext(from, dir + "/" + baseName(from) + ".md", to => ctxName({path: to}) + " is now inside " + ctxName(parent) + ".");
  });
  render();
}
