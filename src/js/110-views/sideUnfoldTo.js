/* A line shown on the page on the right is never under a folded line: the
   way to it is unfolded, as Clarify does (#376). */
function sideUnfoldTo(space, path, id) {
  if (!id) return;
  inSpace(space, () => {
    const page = getPage(path);
    for (const up of (page && branchTrail(page.blocks, id) || []).slice(0, -1)) up.collapsed = false;
  });
}
