/* Their answer has to land on the exact block it came from. The reference
   carries the area and the id::, which survives a reparse and a move to another
   page; the pages of the area are swept for it, so it needs no file path. */
function resolveReplyItem(item) {
  // A reply with no reference was placed by you, on the line you picked (#373).
  if (item.hit) return item.hit;
  const {space, id} = item.ref ? splitReplyRef(item.ref) : {space: "", id: ""};
  if (!id && item.t) {
    let found = null;
    acrossSpaces(() => {
      for (const [p, page] of V.pages) {
        walkBlocks(page.blocks, b => {
          if (!found && trim(humanText(b.title)) === trim(humanText(item.t)))
            found = {space: V.space, path: p, block: b};
        });
        if (found) break;
      }
    });
    return found;
  }
  if (!id) return null;
  const look = () => {
    let hit = null;
    for (const [p, pg] of V.pages) {
      walkBlocks(pg.blocks, b => {
        if (!hit && trim(blockProp(b, "id") || "") === id) hit = {path: p, block: b};
      });
      if (hit) return hit;
    }
    return null;
  };
  const found = space && LOADED.has(space) ? inSpace(space, look) : look();
  return found ? Object.assign({space: space || null}, found) : null;
}
