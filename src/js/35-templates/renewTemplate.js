function renewTemplate(it) {
  inSpace(it.space || V.space, () => {
    const to = join(DIRS.lists, it.next + ".md");
    if (V.pages.has(to)) return;
    const copy = structuredClone(getPage(it.path));
    walkBlocks(copy.blocks, b => { b.id = uid(); });
    copy.props = Object.assign({}, copy.props, {created: todayStamp()});
    if (!copy.props.title || copy.props.title === it.name) copy.props.title = it.next;
    putPage(to, copy);
  });
}
