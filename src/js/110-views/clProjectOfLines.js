/* Several lines that are one piece of work: the first names the project, and
   the others go under it as its steps, so they belong to it (#460). Nothing
   moves until the project is named. */
function clProjectOfLines(path, picks, then) {
  const [head, ...rest] = picks;
  makeFromLine(path, head, "project", null, () => {
    const page = getPage(path), inner = new Set();
    // A picked line under another picked line travels with it.
    for (const b of picks) walkBlocks(b.children, c => { inner.add(c); });
    for (const s of rest.filter(s => !inner.has(s))) {
      removeBlockFrom(page, s);
      (head.children || (head.children = [])).push(s);
      if (!s.state) setBlockState(path, s, "TODO");
    }
    head.collapsed = false;
    then();
  });
}
