function postMessage(path, block, text) {
  const body = trim(text);
  if (!body) return null;
  const m = newBlock({state: null, title: body});
  setBlockProp(m, MSG_PROP, whoAmI() || "Someone");
  setBlockProp(m, MSG_AT, nowStamp());
  (block.children || (block.children = [])).push(m);
  touch(path);
  markThreadRead(block);            // your own words are not news to you
  return m;
}
