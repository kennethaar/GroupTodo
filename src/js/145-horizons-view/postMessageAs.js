function postMessageAs(path, block, text, who, at) {
  const body = trim(text);
  if (!body) return null;
  const m = newBlock({state: null, title: body.replace(/\n+/g, " ")});
  setBlockProp(m, MSG_PROP, who);
  setBlockProp(m, MSG_AT, at);
  (block.children || (block.children = [])).push(m);
  return m;
}
