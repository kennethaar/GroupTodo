/* A copy with every trace of who did what removed. */
function stripAttributionFrom(page) {
  const props = Object.assign({}, page.props || {});
  delete props.updated_by;
  const copy = blocks => (blocks || []).map(b => {
    const bp = Object.assign({}, b.props || {});
    delete bp.by;
    delete bp.done_by;
    return newBlock({
      state: b.state, title: b.title, props: bp,
      body: (b.body || []).slice(), children: copy(b.children),
    });
  });
  return {props, blocks: copy(page.blocks)};
}
