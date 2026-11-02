function orgOfPage(path) {
  const page = path && getPage(path);
  if (!page) return "";
  for (const v of Object.values(page.props || {})) {
    const o = orgIn(String(v || ""));
    if (o) return o;
  }
  return orgIn(pageTitle(path));
}
