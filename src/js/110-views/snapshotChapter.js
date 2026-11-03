function snapshotChapter(path, stage) {
  const page = getPage(path);
  if (!page) return null;
  const copy = structuredClone(page.blocks);
  // Ids belong to the lines in the book, or a link to one would land in the copy.
  walkBlocks(copy, b => { for (const k of Object.keys(b.props || {})) if (k.toLowerCase() === "id") delete b.props[k]; });
  let snap = join(SNAP_DIR, baseName(path) + " - " + stage + " " + todayISO() + ".md"), n = 2;
  while (V.pages.has(snap)) snap = join(SNAP_DIR, baseName(path) + " - " + stage + " " + todayISO() + " " + n++ + ".md");
  putPage(snap, {props: {title: pageTitle(path) + " – " + stage, of: "[[" + pageRef(path) + "]]", stage, archived: "true", created: nowStamp()}, blocks: copy});
  return snap;
}
