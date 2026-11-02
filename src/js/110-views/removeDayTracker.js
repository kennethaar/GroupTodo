function removeDayTracker(path, key) {
  const page = getPage(path), t = parseTracker(key + "::");
  if (!page || !t) return;
  const space = V.space, was = page.props[key];
  delete page.props[key];
  touch(path); render();
  const tpls = trackerTemplatesWith(t.name);
  // Undo either way: Stop tracking is in the tracker's menu (#180).
  notify(trackerTitle(t.name) + " is off this day." + (tpls.length ? " " + [...new Set(tpls.map(x => baseName(x.p)))].join(", ") +
    " will put it on new days." : ""), "info", {label: "Undo", run: () => inSpace(space, () => {
    const pg = getPage(path);
    if (!pg) return;
    pg.props[key] = was; touch(path); render();
  })});
}
