function createDefaultTemplate(name) {
  const path = join(DIRS.lists, name + ".md");
  if (V.pages.has(path)) return path;
  const def = TEMPLATE_DEFAULTS[name] || TEMPLATE_DEFAULTS.page;
  putPage(path, {props:{...def.props},blocks:(def.lines || []).map(title => newBlock({title}, false))});
  return path;
}
