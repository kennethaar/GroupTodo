/* Move, copy or sync pages into another space, asking first what comes along.
   Everything is planned and checked before anything is written, and one
   failure anywhere rolls the whole transfer back. */
async function transferLinkedPages(list, target, opts = {}) {
  if (!LOADED.has(target)) {
    try { await loadSpaceRecord(target); }
    catch (_) { notify("Cannot open the target area. Nothing was moved.", "error"); return false; }
  }
  const plans = [];
  for (const x of list) {
    if (x.from === target) continue;
    const plan = boundedTransferPlan(x.path, x.from);
    // Answered already when the dialog that asked for the move asked it too.
    const choice = opts.choice || await chooseBoundedTransfer(plan, target, opts);
    if (!choice) return false;
    plans.push({...plan, choice});
  }
  if (!plans.length) return false;

  const snapshots = new Map();
  const remember = (space, path) => {
    const key = JSON.stringify([space, path]);
    if (snapshots.has(key)) return;
    const p = LOADED.get(space).pages.get(path);
    snapshots.set(key, {space, path, text: p ? serializePage(p) : null});
  };
  for (const plan of plans) {
    for (const path of [plan.path, ...plan.choice.files]) { remember(plan.space, path); remember(target, path); }
    for (const b of plan.branches) { remember(plan.space, b.path); remember(target, b.path); }
  }
  const restore = () => {
    for (const x of snapshots.values()) inSpace(x.space, () => {
      if (x.text === null) removePage(x.path);
      else { putPage(x.path, parsePage(x.text)); touchHere(x.path); }
    });
    clearMemo();
    flush();
    render();
  };
  for (const plan of plans) for (const path of [plan.path, ...plan.choice.files]) {
    const source = LOADED.get(plan.space).pages.get(path), dest = LOADED.get(target).pages.get(path);
    const sameSynced = plan.choice.mode === "sync" && source?.props?.space_sync_id &&
                       source.props.space_sync_id === dest?.props?.space_sync_id;
    if (dest && !sameSynced && !(path === plan.path && plan.choice.clash)) {
      notify("Stopped: " + path + " already exists in " + target + ". No files were changed.", "warn");
      return false;
    }
  }
  /* A clash on the main file was answered in the dialog: take the target's
     copy out of the way (without a tombstone, since the file stays) and lay
     its lines back over the arriving page afterwards when merging. */
  const merges = [];
  for (const plan of plans) {
    if (!plan.choice.clash) continue;
    const dest = LOADED.get(target).pages.get(plan.path);
    if (!dest) continue;
    if (plan.choice.clash === "merge") merges.push({path: plan.path, dest});
    LOADED.get(target).pages.delete(plan.path);
  }
  // Each step waits on a save, so the bar counts the steps: files, journal lines, the last save.
  const verb = {move: "Moving", copy: "Copying", sync: "Syncing"}[plans[0].choice.mode] || "Moving";
  const what = plans.length === 1 ? inSpace(plans[0].space, () => pageTitle(plans[0].path)) : plans.length + " pages";
  const job = startJob(verb + " " + what + " to " + target);
  const steps = plans.reduce((n, p) => n + 1 + p.branches.length, 1);
  let step = 0;
  try {
    for (const plan of plans) {
      // Copy or sync first; a move removes the source only once the journal lines are saved too.
      const stageMode = plan.choice.mode === "move" ? "copy" : plan.choice.mode;
      const files = [plan.path, ...plan.choice.files].map(path => ({path, from: plan.space}));
      job.set(step, steps, files.length === 1 ? "the page" : files.length + " pages");
      if (!await copyPagesToSpace(files, target, {mode: stageMode, inner: true}))
        throw new Error("The files could not be saved.");
      job.set(++step, steps);
      for (const branch of plan.branches) {
        job.set(step, steps, "journal line " + (plan.branches.indexOf(branch) + 1) + " of " + plan.branches.length);
        if (!await transferBranch(branch, target, {mode: plan.choice.mode, references: false, inner: true}, {path: branch.path}))
          throw new Error("A journal line could not be saved.");
        job.set(++step, steps);
      }
      if (plan.choice.mode === "move") for (const x of files) inSpace(plan.space, () => removePage(x.path));
    }
    job.set(step, steps, "saving");
    for (const m of merges) inSpace(target, () => {
      const page = getPage(m.path);
      if (!page) return;
      page.props = Object.assign({}, m.dest.props, page.props);
      page.blocks = [...(m.dest.blocks || []), ...(page.blocks || [])];
      touch(m.path);
    });
    await flush();
    if ([...LOADED.values()].some(r => r.dirty.size || r.removed.size))
      throw new Error("The transfer could not be saved completely.");
    pushUndo({run: () => { restore(); return true; }});
    render();
    job.finish({Moving: "Moved", Copying: "Copied", Syncing: "Synced"}[verb] + " to " + target + ".");
    return true;
  } catch (e) {
    job.finish();
    restore();
    await flush();
    notify("Transfer rolled back: " + e.message, "error");
    return false;
  }
}
