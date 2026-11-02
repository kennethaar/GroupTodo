function ensureTrackerPage(name) {
  const at = trackerPageAt(name);
  if (at) return at;
  inSpace(trackerArea(name), () => putPage(trackerPagePath(name),
    {props: {title: trackerTitle(name), created: todayStamp()}, blocks: [newBlock({title: ""})]}));
  return trackerPageAt(name);
}
