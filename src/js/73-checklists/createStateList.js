function createStateList(title, stages) {
  const path = join(DIRS.lists, slugify(title) + ".md");
  if (V.pages.has(path)) return path;
  const page = pageFromTemplate("k", slugify(title), {kind: "states"});
  page.props.kind = "states";
  delete page.props.cadence;
  page.blocks = stages.map(s => newBlock({title: s}, false));
  putPage(path, page);
  return path;
}
