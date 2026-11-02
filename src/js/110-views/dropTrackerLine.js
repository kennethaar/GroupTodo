function dropTrackerLine(path, name) {
  const page = getPage(path);
  if (!page) return;
  const mine = t => !!t && t.name === name;
  for (const k of Object.keys(page.props || {})) if (mine(parseTracker(k + "::"))) delete page.props[k];
  const drop = list => list.filter(b => !mine(parseTracker(b.title)))
    .map(b => { if (b.children) b.children = drop(b.children); return b; });
  page.blocks = drop(page.blocks || []);
  // A template the schedule made, with nothing left in it, goes with the line.
  if (isWhenName(baseName(path)) && baseName(path) !== "journals" && emptyTemplate(page)) removePage(path);
  else touch(path);
}
