/* A line on the page as it is now. A page read back from its folder after a
   save is made of new blocks, so failing the block itself it is the last
   line that reads the same -- the one just pasted, at the end -- and not one
   already taken, since a mail can say "Kind regards" twice. */
function findOnPage(page, want, taken = new Set()) {
  let same = null, like = null;
  const rec = list => list.forEach((b, i) => {
    if (b === want) same = {list, i, b};
    else if (!taken.has(b) && b.title === want.title && (b.state || null) === (want.state || null)) like = {list, i, b};
    rec(b.children || []);
  });
  rec(page.blocks);
  return same || like;
}
