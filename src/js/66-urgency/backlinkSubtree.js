/* The outline as the page itself draws it -- a bullet per line, a ring on one
   with lines under it, each level indented under its parent -- but read-only
   and without the page's own .blk classes, which the editor's handlers own.
   A task's tick works where it shows (#322): ticking a day-page task from its
   project is the point of seeing it there. Hide done (#321) leaves out a
   closed line and what is under it, as on the page. */
function backlinkSubtree(block, path, hideDone) {
  const kids = shownLines(block?.children || [], {hideDone});
  const node = el("div", {class: "bl-node" + (kids.length ? " has-kids" : "")});
  const gap = !block?.state && !trim(block?.title) && !kids.length;
  const kind = bujoKind(block?.title, block?.state);
  node.append(el("div", {class: "bl-line" + (gap ? " blank" : "") + (kind ? " " + kind : "")},
    el("span", {class: "bl-bullet", "aria-hidden": "true"}),
    path && block?.id && block.state ? backlinkTick(path, block) : stateChip(block?.state, block),
    el("div", {class: "bl-txt", translate: "no", html: renderInline(bujoText(block?.title))})));
  for (const body of block?.body || [])
    node.append(el("div", {class: "bl-body", translate: "no", html: renderInline(body)}));
  for (const child of kids) node.append(backlinkSubtree(child, path, hideDone));
  return node;
}
