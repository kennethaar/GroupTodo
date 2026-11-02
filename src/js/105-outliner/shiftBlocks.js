/* Alt-shift and an arrow, as in Logseq: the line -- or the run of picked lines
   beside each other -- moves one place with everything under it. Past the
   first or last of its siblings it goes on into the parent's neighbour, at
   the same depth, so a line can travel the whole outline one key at a time. */
function shiftBlocks(page, blocks, dir) {
  if (!blocks.length) return false;
  const sibs = siblingsOf(page, blocks[0]);
  const at = blocks.map(b => sibs.indexOf(b)).sort((x, y) => x - y);
  if (at[0] < 0 || at.some((v, k) => v !== at[0] + k)) return false;  // one run of siblings only
  const lo = at[0], hi = at[at.length - 1], group = sibs.slice(lo, hi + 1);
  if (dir < 0 ? lo > 0 : hi < sibs.length - 1) {
    sibs.splice(lo, group.length);
    sibs.splice(lo + dir, 0, ...group);
    return true;
  }
  const par = parentOf(page, blocks[0]);
  if (!par) return false;
  const psibs = siblingsOf(page, par), into = psibs[psibs.indexOf(par) + dir];
  if (!into) return false;
  sibs.splice(lo, group.length);
  const kids = into.children || (into.children = []);
  if (dir < 0) kids.push(...group); else kids.unshift(...group);
  into.collapsed = false;
  return true;
}
