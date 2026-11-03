const blockWithId = (path, id) => { let hit = null; if (id) walkBlocks(getPage(path)?.blocks, b => { if (trim(blockProp(b, "id") || "") === id) hit = b; }); return hit; };
