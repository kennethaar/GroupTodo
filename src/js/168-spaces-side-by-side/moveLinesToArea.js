/* Lines, with what is under them, into another area, and the pages they link
   to with them. A linked page that other pages link to as well is mirrored
   instead, so those pages keep their link, and a toast says so. One failure
   anywhere puts everything back, and one ctrl-z does the same later. */
async function moveLinesToArea(items, target) {
  if (!items.length) return false;
  if (!LOADED.has(target)) {
    try { await loadSpaceRecord(target); }
    catch (_) { notify("Cannot open the target area. Nothing was moved.", "error"); return false; }
  }
  const space = items[0].space;
  const {move, mirror} = linkedMoveKinds(items, target);
  const titles = list => inSpace(space, () => list.map(p => pageTitle(p)));
  const mirrored = titles(mirror);

  const snapshots = new Map();
  const remember = (name, path) => {
    const key = JSON.stringify([name, path]);
    if (snapshots.has(key)) return;
    snapshots.set(key, {name, path, text: inSpace(name, () => {
      const p = getPage(path);
      return p ? serializePage(p) : null;
    })});
  };
  for (const x of items) {
    remember(space, x.path);
    remember(target, inSpace(target, () => isJournalPath(x.path) ? journalPath((/\d{4}-\d{2}-\d{2}/.exec(x.path) || [todayISO()])[0]) : x.path));
  }
  for (const path of [...move, ...mirror]) { remember(space, path); remember(target, path); }
  const restore = () => {
    for (const x of snapshots.values()) inSpace(x.name, () => {
      if (x.text === null) removePage(x.path);
      else { putPage(x.path, parsePage(x.text)); touchHere(x.path); }
    });
    clearMemo();
    flush();
    render();
  };

  try {
    for (const [paths, mode] of [[move, "move"], [mirror, "sync"]])
      if (paths.length && !await copyPagesToSpace(paths.map(path => ({path, from: space})), target, {mode, inner: true}))
        throw new Error("The linked pages could not be saved.");
    for (const x of items)
      if (!await transferBranch({space, path: x.path, id: x.id}, target, {mode: "move", references: false, inner: true}))
        throw new Error("A line could not be saved.");
  } catch (e) {
    restore();
    await flush();
    notify("Move rolled back: " + e.message, "error");
    return false;
  }
  pushUndo({run: () => { restore(); return true; }});
  notify((items.length === 1 ? "Line" : items.length + " lines") + " moved to " + target +
    (move.length ? ", with " + (move.length === 1 ? "1 linked page" : move.length + " linked pages") : "") + ".");
  if (mirror.length) notify("Other pages link to " + mirrored.join(", ") + ", so " +
    (mirror.length === 1 ? "it was" : "they were") + " mirrored instead of moved.", "warn");
  return true;
}
