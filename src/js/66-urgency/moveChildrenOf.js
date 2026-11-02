/* A page is also the folder of the pages under it: c/PC.md has c/PC/email.md
   and [[c/PC/build]]. Renamed, its children go with it, files and links both.
   Not through moveFile, which would rewrite [[c/PC/email]] to its short ref
   [[c/email]] and lift it out of the folder. */
function moveChildrenOf(oldPath, newPath, oldRef) {
  const oldDir = oldPath.replace(/\.md$/i, "") + "/", newDir = newPath.replace(/\.md$/i, "") + "/";
  const newRef = pageRef(newPath);
  for (const child of allPages(p => p.startsWith(oldDir))) {
    const to = newDir + child.slice(oldDir.length);
    if (V.pages.has(to)) { mergePageInto(child, to, {links: false}); continue; }
    const page = getPage(child);
    V.pages.delete(child);
    V.dirty.delete(child);
    V.removed.add(child);
    addTombstone(child);
    dropTombstone(to);
    putPage(to, page);
    for (const snap of NAV_HIST) if (snap.space === Spaces.active && snap.pagePath === child) snap.pagePath = to;
    if (state.pagePath === child) state.pagePath = to;
  }
  // Every [[c/PC/…]] and #c/PC/…, whether or not it has a page of its own.
  const names = new Set();
  const collect = value => {
    if (typeof value !== "string") return;
    for (const m of value.matchAll(NAMED_REF_RE)) {
      const name = m[4] !== undefined ? m[4] : m[1].split("|")[0].split("#")[0];
      if (name.startsWith(oldRef + "/")) names.add(name);
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
  let n = 0;
  for (const name of names) n += rewriteLinksEverywhere(name, newRef + name.slice(oldRef.length));
  if (n) notify("Link update: " + n + " pages updated under " + newRef + ".");
  clearMemo();
}
