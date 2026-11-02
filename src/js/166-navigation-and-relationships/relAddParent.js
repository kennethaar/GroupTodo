function relAddParent(parent, child) {
  if (!parent.block && !child.block && isContextPath(parent.path) && isContextPath(child.path)) return nestContext(parent, child);
  if (parent.space !== child.space) { notify("Relationships must be in the same area.", "warn"); return; }
  if (relWouldCycle(parent, child)) { notify("That would create a parent cycle.", "warn"); return; }
  inSpace(parent.space, () => {
    const props = relProps(parent), ref = relRef(child), old = props.children ?? props.parent_of;
    if (linksIn(old || "").includes(ref)) return;
    props.children = trim(old || "") + (trim(old || "") ? ", " : "") + "[[" + ref + "]]";
    delete props.parent_of;
    touch(parent.path);
    pushUndo({run: () => {
      inSpace(parent.space, () => {
        const p = relProps(parent);
        if (old == null) delete p.children; else p.children = old;
        delete p.parent_of;
        touch(parent.path);
      });
      render();
      return true;
    }});
  });
  render();
  notify("Child linked. Dependencies were not changed.");
}
