function relatedBlockOf(page) {
  let b = (page.blocks || []).find(x => trim(x.title) === RELATED_BLOCK);
  if (!b) { b = newBlock({title: RELATED_BLOCK}); page.blocks.push(b); }
  if (!b.children) b.children = [];
  return b;
}
