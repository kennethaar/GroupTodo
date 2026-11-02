function removeLinkFromProp(space, path, key, ref) {
  inSpace(space, () => {
    const page = getPage(path); if (!page) return;
    const k = Object.keys(page.props).find(x => x.toLowerCase() === key);
    if (!k) return;
    const left = linksIn(page.props[k]).filter(l => trim(l.split("][")[0]).toLowerCase() !== ref.toLowerCase());
    if (left.length) page.props[k] = left.map(l => "[[" + l + "]]").join(", "); else delete page.props[k];
    touch(path);
  });
  render();
}
