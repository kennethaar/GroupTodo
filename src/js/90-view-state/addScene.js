function addScene(path, name) {
  const page = getPage(path);
  name = oneLine(name);
  if (!page || !name) return null;
  const head = newBlock({title: "## " + name}, false), first = newBlock({title: ""}, false);
  page.blocks.push(head, first);
  touch(path);
  return first;
}
