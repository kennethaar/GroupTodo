function calKeysOn(page) {
  const keys = new Map();
  walkBlocks(page.blocks, b => { const k = blockProp(b, "cal_uid"); if (k) keys.set(k, calLook(b.title, blockProp(b, "time"))); });
  return keys;
}
