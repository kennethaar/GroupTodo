function countStamps() {
  let n = 0;
  for (const [, page] of V.pages) {
    if (page.props && page.props.updated_by) n++;
    walkBlocks(page.blocks, b => { if (b.props && (b.props.by || b.props.done_by)) n++; });
  }
  return n;
}
