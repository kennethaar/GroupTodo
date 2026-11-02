function setUpdateEvery(to, value) {
  if (!stakePage(to)) createLinkedPages("[[" + stakeRef(to) + "]]");
  const at = stakePage(to);
  if (!at) return;
  inSpace(at.space, () => {
    const page = getPage(at.path);
    if (value === UPDATE_EVERY_DEFAULT) delete page.props[UPDATE_EVERY_PROP]; else page.props[UPDATE_EVERY_PROP] = value;
    touch(at.path);
  });
  render();
}
