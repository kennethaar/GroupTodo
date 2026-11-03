function saveSidebar(order, hidden) {
  if (!getPage(SIDEBAR_PATH)) putPage(SIDEBAR_PATH, {props: {title: "sidebar", created: todayStamp()}, blocks: []});
  const page = getPage(SIDEBAR_PATH);
  page.blocks = order.map(t => newBlock({title: t === NAV_SEP ? NAV_SEP : navEntry(t).label}));
  const hide = order.filter(t => hidden.has(t) && t !== NAV_KEEP).map(t => navEntry(t).label).join(", ");
  if (hide) page.props.hide = hide; else delete page.props.hide;
  touch(SIDEBAR_PATH);
  render();
}
