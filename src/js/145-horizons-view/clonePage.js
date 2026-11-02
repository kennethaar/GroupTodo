function clonePage(page) {
  return {
    props: Object.assign({}, page.props || {}),
    blocks: (page.blocks || []).map(cloneBlock),
  };
}
