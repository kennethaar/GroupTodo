function mergePageInto(sourcePath, targetPath, {links = true, temp = false, undo = true} = {}) {
  const src = getPage(sourcePath), tgt = getPage(targetPath);
  if (!src || !tgt || sourcePath === targetPath) return false;
  trackSave("Merging " + pageTitle(sourcePath) + " into " + pageTitle(targetPath), sourcePath);
  const srcCopy = clonePage(src);
  tgt.props = tgt.props || {};

  const added = [];
  for (const [k, v] of Object.entries(src.props || {})) {
    const key = k.toLowerCase();
    if (key === "title" || key === "updated" || key === "updated_by") continue;
    if (key === DEPENDS_PROP) continue;                 // unioned, not overwritten
    if (trim(tgt.props[k] || "")) continue;             // the survivor's own value stands
    tgt.props[k] = v; added.push(k);
  }
  const prevChain = tgt.props[DEPENDS_PROP] ?? null;
  const chain = [];
  for (const raw of linksIn([prevChain || "", src.props?.[DEPENDS_PROP] || ""].join(", "))) {
    const link = "[[" + trim(String(raw).split("][")[0]) + "]]";
    if (!chain.includes(link)) chain.push(link);
  }
  if (chain.length) tgt.props[DEPENDS_PROP] = chain.join(", ");

  const have = new Set();
  walkBlocks(tgt.blocks, b => { have.add(mergeLineKey(b)); });
  const brought = (src.blocks || [])
    .filter(b => trim(b.title) || (b.children || []).length || (b.body || []).length)
    .filter(b => (b.children || []).length || !have.has(mergeLineKey(b)))
    .map(cloneBlock);
  tgt.blocks.push(...brought);

  const oldRef = pageRef(sourcePath), oldBase = baseName(sourcePath), newRef = pageRef(targetPath);
  if (temp) { V.pages.delete(sourcePath); V.dirty.delete(sourcePath); }
  else removePage(sourcePath);
  touch(targetPath);
  if (links) {
    let n = rewriteLinksEverywhere(oldRef, newRef);
    if (oldBase !== baseName(targetPath) || oldRef !== oldBase) n += rewriteLinksEverywhere(oldBase, newRef);
    if (n) notify("Link update: " + n + " pages updated.");
  }

  const back = () => {
    const t = getPage(targetPath);
    if (t) {
      t.blocks = (t.blocks || []).filter(b => !brought.includes(b));
      for (const k of added) delete t.props[k];
      if (prevChain == null) delete t.props[DEPENDS_PROP]; else t.props[DEPENDS_PROP] = prevChain;
      touch(targetPath);
    }
    if (!V.pages.has(sourcePath)) {
      V.removed.delete(sourcePath); dropTombstone(sourcePath);
      putPage(sourcePath, clonePage(srcCopy));
    }
    render();
    notify("Split back out. The links still point at " + pageTitle(targetPath) + ".");
  };
  const word = brought.length === 1 ? "1 line" : brought.length + " lines";
  // Nothing new on the arriving page: it was an old copy of the one already there.
  const leftover = !brought.length && !added.length && (prevChain ?? "") === (tgt.props[DEPENDS_PROP] ?? "");
  notify(leftover
    ? pageTitle(targetPath) + " was already there; the old copy had nothing it lacked, so only one is left."
    : pageTitle(targetPath) + " was already there, so the two are one page now - " + word + " came across.",
    "info", temp || !undo ? null : {label: "Undo", run: back});
  return "merged";
}
