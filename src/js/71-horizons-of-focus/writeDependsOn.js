function writeDependsOn(path, paths) {
  const page = getPage(path); if (!page) return;
  const links = paths.map(p => "[[" + pageRef(p) + "]]");
  for (const k of Object.keys(page.props)) if (k.toLowerCase() === DEPENDS_PROP) delete page.props[k];
  page.props[DEPENDS_PROP] = links.length ? links.join(", ") : NOTHING_FIRST;
  touch(path);
}
