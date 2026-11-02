/* Write these exact pages into the target space -- moved, copied or synced --
   refusing to touch a page already there unless it is a synced copy of the
   same one. Nothing is removed from the source until the target has saved.

   {branchReferences} carries the pages a branch links to instead of the
   listed paths themselves; {inner} marks a step of a larger transfer, which
   records its own single undo. */
async function copyPagesToSpace(list, target, {mode: wanted, copy, exclude = [], branchReferences, inner} = {}) {
  if (!LOADED.has(target)) {
    try { await loadSpaceRecord(target); }
    catch (_) { notify("Cannot open the target area. Nothing was moved.", "error"); return false; }
  }
  const mode = wanted || (copy ? "copy" : "move");
  const plans = [];
  for (const x of list) {
    if (x.from === target) continue;
    const paths = (branchReferences ? branchReferenceFiles(x.path, x.from) : [x.path])
      .filter(p => !exclude.includes(p))
      .filter(p => !branchReferences || !LOADED.get(target).pages.has(p));
    if (paths.length) plans.push({from: x.from, paths});
  }
  if (!plans.length) return !!branchReferences;

  const snapshots = new Map();
  const remember = (name, path) => {
    const key = JSON.stringify([name, path]);
    if (snapshots.has(key)) return;
    snapshots.set(key, {name, path, text: inSpace(name, () => {
      const p = getPage(path);
      return p ? serializePage(p) : null;
    })});
  };
  // No silent merging into, or overwriting of, an unrelated page in the target.
  for (const plan of plans) for (const path of plan.paths) {
    const source = LOADED.get(plan.from).pages.get(path), dest = LOADED.get(target).pages.get(path);
    const sameSynced = mode === "sync" && source.props?.space_sync_id &&
                       dest?.props?.space_sync_id === source.props.space_sync_id;
    if (dest && !sameSynced) {
      notify("Stopped: " + path + " already exists in " + target + ". No files were changed.", "warn");
      return false;
    }
    remember(plan.from, path);
    remember(target, path);
  }

  for (const plan of plans) for (const path of plan.paths) {
    const source = LOADED.get(plan.from).pages.get(path), page = parsePage(serializePage(source));
    await copyTransferAssets(source, plan.from, target);
    if (mode === "sync") {
      let peers = [];
      try { peers = JSON.parse(source.props.space_sync_peers || "[]"); } catch (_) {}
      const id = source.props.space_sync_id || uid();
      const names = [...new Set([...peers, plan.from, target])];
      for (const name of names) if (LOADED.has(name)) remember(name, path);
      source.props.space_sync_id = page.props.space_sync_id = id;
      source.props.space_sync_peers = page.props.space_sync_peers = JSON.stringify(names);
    } else {
      delete page.props.space_sync_id;
      delete page.props.space_sync_peers;
    }
    inSpace(target, () => { putPage(path, page); touch(path); });
    if (mode === "sync") inSpace(plan.from, () => touch(path));
  }
  await flush();
  // A failed write leaves the page dirty. Never delete the source then.
  if (LOADED.get(target).dirty.size) {
    notify("The target could not be saved. The originals are kept.", "warn");
    render();
    return false;
  }
  if (mode === "move") for (const plan of plans) for (const path of plan.paths) inSpace(plan.from, () => removePage(path));
  await flush();
  render();
  if (inner) return true;
  pushUndo({run: () => {
    for (const x of snapshots.values()) inSpace(x.name, () => {
      if (x.text === null) removePage(x.path);
      else { putPage(x.path, parsePage(x.text)); touchHere(x.path); }
    });
    clearMemo();
    flush();
    render();
    return true;
  }});
  notify("Files transferred to " + target + ".");
  return true;
}
