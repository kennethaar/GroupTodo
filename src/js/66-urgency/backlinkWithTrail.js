/* The lines the hit hangs under come first, greyed and without their other
   children, so a link deep in a branch still says what it was about. */
function backlinkWithTrail(hit, opts) {
  let tree = backlinkSubtree(hit.block, opts);
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
