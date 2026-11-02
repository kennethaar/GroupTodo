/* Every spelling that resolves to this page right now: its ref, its path with
   and without .md, and any bare name, tag or link text in the vault that
   lands on it. Read before a move, because afterwards none of them resolve.
   A bare name that would resolve somewhere else is left out, so moving one
   "notes" page does not rewrite links meant for another. */
function spellingsOf(path) {
  const found = new Set([pageRef(path), path, path.replace(/\.md$/i, "")]);
  if (findExistingPage(baseName(path)) === path) found.add(baseName(path));
  const collect = value => {
    if (typeof value !== "string") return;
    for (const m of value.matchAll(NAMED_REF_RE)) {
      const name = m[4] !== undefined ? m[4] : m[1].split("|")[0].split("#")[0];
      if (findExistingPage(name) === path) found.add(name);
    }
  };
  for (const page of V.pages.values()) {
    Object.values(page.props || {}).forEach(collect);
    walkBlocks(page.blocks, b => {
      collect(b.title);
      Object.values(b.props || {}).forEach(collect);
      (b.body || []).forEach(collect);
    });
  }
  return found;
}
