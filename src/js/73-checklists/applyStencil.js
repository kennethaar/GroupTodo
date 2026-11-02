function applyStencil(listPath, targetPath, context) {
  const list = getPage(listPath), target = getPage(targetPath);
  if (!list || !target) return {lines: 0, fields: 0};
  const ctx = context || state.context;
  const vars = {name: pageTitle(targetPath), title: pageTitle(targetPath), project: pageTitle(targetPath),
                date: todayISO(), created: "[[" + todayISO() + "]]"};
  const todos = stencilMakesTodos(listPath);

  let fields = 0;
  for (const [k, v] of Object.entries(list.props || {})) {
    if (STENCIL_OWN_PROPS.has(k.toLowerCase())) continue;
    if (Object.keys(target.props || {}).some(have => have.toLowerCase() === k.toLowerCase())) continue;
    target.props[k] = expandVars(v, vars);
    createLinkedPages(target.props[k]);
    fields++;
  }

  let n = 0;
  const copy = blocks => (blocks || []).map(b => {
    n++;
    const title = expandVars(b.title, vars);
    const state_ = b.state || (todos ? "TODO" : null);
    return stampAuthor(newBlock({
      state: state_,
      // A context belongs on something you are going to do, not on a heading.
      title: title + (state_ && ctx && !hasContextLink(title) ? " [[c/" + ctx + "]]" : ""),
      props: {},
      body: (b.body || []).map(l => expandVars(l, vars)),
      children: copy(b.children),
    }));
  });
  const copied = copy(list.blocks);

  if (todos) {
    const parent = newBlock({
      // The list's name once, as a link to the list: [[8/daily][Daily checklist]].
      title: "[[8/" + baseName(listPath) + "][" + pageTitle(listPath) + "]]",
      props: {},
    });
    parent.children = copied;
    target.blocks.push(parent);
  } else {
    target.blocks.push(...copied);
  }
  touch(targetPath);
  return {lines: n, fields};
}
