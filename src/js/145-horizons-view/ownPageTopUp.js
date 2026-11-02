/* A page made before a part existed gets that part, in the standard words,
   in its place among the others: the email's parts came after the plain
   text's, and editing the page should show what the email says (#162). */
function ownPageTopUp(path, parts, seed) {
  const page = getPage(path), blocks = [...(page.blocks || [])], fresh = seed().blocks;
  const key = b => plainTitle(b.title).toLowerCase().replace(/:\s*$/, "");
  let added = 0;
  parts.forEach(([part], i) => {
    if (blocks.some(b => key(b) === part)) return;
    let at = 0;
    for (let j = i - 1; j >= 0 && !at; j--) at = blocks.findIndex(b => key(b) === parts[j][0]) + 1;
    blocks.splice(at, 0, fresh[i]);
    added++;
  });
  if (added) putPage(path, Object.assign({}, page, {blocks}));
}
