function setKeyHidden(path, key, hide) {
  const lc = key.toLowerCase();
  const holders = hide ? [hiddenHolder(path)] : [path, hiddenHolder(path)];
  for (const at of new Set(holders)) {
    const page = getPage(at);
    if (!page) continue;
    const props = page.props || (page.props = {});
    const list = hiddenList(props[HIDDEN_PROP]).filter(k => k !== lc);
    if (hide) list.push(lc);
    const before = props[HIDDEN_PROP] || "";
    if (list.length) props[HIDDEN_PROP] = list.join(", "); else delete props[HIDDEN_PROP];
    if ((props[HIDDEN_PROP] || "") !== before) touch(at);
  }
  render();
  if (hide) notify("\u201C" + key + "\u201D is under hidden values" +
    (hiddenHolder(path) !== path ? " on every page made from " + pageTitle(hiddenHolder(path)) + "." : "."));
}
