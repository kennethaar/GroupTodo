function planActionBlock(a) {
  const b = stampAuthor(newBlock({state: a.state, title: a.title, props: {}}));
  for (const [k, v] of Object.entries(a.props)) setBlockProp(b, k, v);
  return b;
}
