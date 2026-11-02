async function followDeepLink(link) {
  if (link.space && link.space !== Spaces.active) {
    if (Spaces.get(link.space)) await openSpace(link.space);
    else { notify("That link is for an area called \u201C" + link.space + "\u201D, which is not on this device.", "warn"); return false; }
  }
  if (!V.pages.has(link.path)) {
    notify("That link points at a page this vault does not have: " + link.path, "warn");
    return false;
  }
  if (link.block) {
    let found = null;
    walkBlocks(getPage(link.path).blocks, b => {
      if (!found && trim(blockProp(b, "id") || "") === link.block) found = b;
    });
    if (found) {
      openPage(link.path);
      state.selected = found.id;
      setTimeout(() => openTaskDetail(link.path, found), 120);
      return true;
    }
    notify("The page is here, but that particular item has gone.", "warn");
  }
  openPage(link.path);
  return true;
}
