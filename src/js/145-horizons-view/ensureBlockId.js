function ensureBlockId(path, block) {
  let id = trim(blockProp(block, "id") || "");
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    setBlockProp(block, "id", id);
    touch(path);
  }
  return id;
}
