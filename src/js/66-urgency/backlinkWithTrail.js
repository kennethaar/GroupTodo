/* The lines the hit hangs under come first, greyed and without their other
   children, so a link deep in a branch still says what it was about. The hit
   and what is under it are the page's own lines, to write in (#425), except on
   somebody else's day page, which is theirs to write. A when-value hit has no
   line of its own and stays words. */
function backlinkWithTrail(hit, hideDone) {
  const page = hit.block?.id && getPage(hit.path);
  const theirs = isJournalPath(hit.path) && !!journalOwnerOf(hit.path) && !myJournal(hit.path);
  let tree = page
    ? el("div", {class: "outline" + (theirs ? " readonly" : "")},
        outlineBlock(hit.path, page, hit.block, {hideDone, readonly: theirs}))
    : backlinkSubtree(hit.block, hit.path, hideDone);
  for (const a of (hit.trail || []).slice().reverse()) {
    const kind = bujoKind(a.title, a.state);
    const up = el("div", {class: "bl-node has-kids bl-trail"},
      el("div", {class: "bl-line" + (kind ? " " + kind : "")},
        el("span", {class: "bl-bullet", "aria-hidden": "true"}),
        stateChip(a.state, a),
        el("div", {class: "bl-txt", translate: "no", html: renderInline(bujoText(a.title))})));
    up.append(tree);
    tree = up;
  }
  return tree;
}
