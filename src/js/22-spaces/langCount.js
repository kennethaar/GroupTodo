function langCount(name) {
  const {pairs} = langParse(langTextOf(name));
  const all = [...LANG_CATALOG.s, ...LANG_CATALOG.t];
  return {done: all.filter(k => pairs.get(k)).length, all: all.length};
}
