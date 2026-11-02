function mergePageContents(local, incoming, preferIncoming) {
  const props = preferIncoming
    ? Object.assign({}, local.props || {}, incoming.props || {})
    : Object.assign({}, incoming.props || {}, local.props || {});
  return {props, blocks: mergeBlockLists(local.blocks || [], incoming.blocks || [], preferIncoming)};
}
