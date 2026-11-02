function hiddenKeys(path) {
  const own = getPage(path)?.props?.[HIDDEN_PROP];
  const holder = hiddenHolder(path);
  return new Set(hiddenList(own).concat(holder === path ? [] : hiddenList(getPage(holder)?.props?.[HIDDEN_PROP])));
}
