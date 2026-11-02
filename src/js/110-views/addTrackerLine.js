function addTrackerLine(name, key) {
  const path = join(DIRS.lists, name + ".md");
  const line = key + "::";
  if (!V.pages.has(path)) {
    putPage(path, {props: {title: name, created: todayStamp()}, blocks: [newBlock({title: line}, false)]});
    return;
  }
  const page = getPage(path);
  if (pageHasTracker(page, parseTracker(line).name)) return;
  page.blocks.push(newBlock({title: line}, false));
  touch(path);
}
