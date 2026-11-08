function ensureFeelings() {
  if (V.pages.has(FEELINGS_PATH)) return FEELINGS_PATH;
  const page = pageFromTemplate("k", "Feelings", {kind: "words"});
  page.props.kind = "words";
  page.props.lines = "=";
  delete page.props.cadence;
  const put = ts => ts.map(t => newBlock({title: t.name, children: put(t.kids)}, false));
  page.blocks = put(builtinFeelings());
  putPage(FEELINGS_PATH, page);
  return FEELINGS_PATH;
}
