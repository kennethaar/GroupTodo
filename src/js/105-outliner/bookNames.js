/* An area with a book offers its own names only, and its pages too: writing
   Vary's scene, Vary is the name you mean, not Victor Borge from work (#241).
   Its chapters are left out, and so is what the area keeps for itself. */
function bookNames(space) {
  return memo("bookNames" + space, () => inSpace(space, () => {
    ACROSS++;
    try { return namesHere(true); } finally { ACROSS--; }
  }));
}
