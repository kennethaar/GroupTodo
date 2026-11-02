/* A project to hang things under. Paths, not names: a parent is a particular
   file, and a card in another space cannot point at it. */
function pickProject({title, onPick, exclude = []}) {
  const items = acrossSpaces(() => allPages(q => statusDirOf(q) && !isHorizonPage(q))
    .map(path => ({path, space: V.space})))
    .filter(r => !exclude.some(e => e.path === r.path && e.space === r.space));
  if (!items.length) { notify("No projects to hang these under yet.", "warn"); return; }
  listPicker({
    title, items, typeahead: true,
    label: r => rowTitle(r),
    detail: r => (multiSpace() ? r.space + " \u00B7 " : "") + pageRef(r.path),
    onPick,
  });
}
