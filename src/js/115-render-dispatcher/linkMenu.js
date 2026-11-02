/* The same menu from somewhere that already knows which line it is on -- the
   surroundings grid, a dialog -- so a pill there offers what a pill in the
   outline offers instead of being the one place that still jumps straight to
   the page. The line is handed in rather than looked up, because a chip in a
   grid is not rendered inside the line it came from.

   A space is handed in with it: the alternatives and the page behind the link
   are that vault's, not the one on screen. */
function linkMenu(ref, a, space) {
  const inIt = fn => (space ? inSpace(space, fn) : fn());
  const kind = linkKindOf(ref);
  const label = ref.replace(/^[^/]+\//, "");
  const shownNow = kind === "context" ? "@" + label : label;
  let i = 0;
  const rows = [[MENU_KEYS[i++], "Go to " + shownNow, "the page itself",
    () => inIt(() => followLink(ref))]];

  /* No line behind it means nothing to change or remove: a pill in a heading
     is just a link. */
  if (a && kind) {
    let first = true;
    for (const [r, shown] of inIt(() => linkAlternatives(kind))) {
      if (r.toLowerCase() === ref.toLowerCase()) continue;
      rows.push([MENU_KEYS[i++] || "", shown, first ? "change it to this" : null,
        () => { if (swapLinkIn(a, ref, r)) { notify("Now " + shown + "."); render(); } }]);
      first = false;
    }
    rows.push([MENU_KEYS[i++] || "", "Take it off the line", "the words stay",
      () => { if (swapLinkIn(a, ref, null)) { notify("Took " + shownNow + " off."); render(); } }]);
  }
  chipMenu(shownNow, kind ? "the " + kind + " on this line" : "this link", rows);
}
