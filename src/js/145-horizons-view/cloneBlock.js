/* Blocks carry a _parent back-reference for the outliner, so a structured
   clone has to be explicit: JSON.stringify walks straight into the cycle.
   Internal keys begin with an underscore and are rebuilt, never copied. */
function cloneBlock(b) {
  const out = newBlock({
    state: b.state ?? null,
    title: b.title || "",
    props: Object.assign({}, b.props || {}),
    body: (b.body || []).slice(),
    collapsed: !!b.collapsed,
  });
  out.children = (b.children || []).map(cloneBlock);
  return out;
}
