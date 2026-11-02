/* Every step of the tour, open or closed, with the door it points at. */
function tourSteps(path) {
  const p = path || tourProjectPath();
  const page = p && getPage(p);
  if (!page) return [];
  return flattenBlocks(page.blocks)
    .filter(b => b.state && tourDestOf(b.title))
    .map(b => ({path: p, block: b, dest: tourDestOf(b.title),
                open: !!OPEN_STATES[b.state], seen: tourSeen(tourDestOf(b.title))}));
}
