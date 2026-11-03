function flyPick(k, v) {
  if (!FLY) return;
  flyCommit();
  const {path, block} = FLY;
  if (k === "state" && v && v[0] === "\u0001") {
    const ts = taskStage(block);
    if (ts) setTaskStage(path, block, ts.list, v.slice(1));
    focusBlock(block.id); return;
  }
  if (k === "ask") { FLY.txt.blur(); openAskForUpdate(v, block); return; }
  if (k === "state") { setBlockState(path, block, v || null); if (v === "WAIT" && !assigneeOf(block)) { FLY_OPEN_AFTER = {id: block.id, k: "who"}; } focusBlock(block.id); return; }
  if (k === "due") { flyMakeTask(path, block); setDue(block, v || null); touch(path); warnDueConflict(path, block); return flyAfter(k); }
  if (k === "ctx") {
    flyMakeTask(path, block);
    if (v) { if (hasContextLink(block.title)) block.title = trim(block.title.replace(/\[\[c\/[^\]]+\]\]/, "[[c/" + v + "]]")); else block.title = trim(block.title) + " [[c/" + v + "]]"; }
    else block.title = trim(block.title.replace(/\[\[c\/[^\]]+\]\]/, "").replace(/\s{2,}/g, " "));
    createLinkedPages(block.title); touch(path); return flyAfter(k);
  }
  if (k === "who") {
    flyMakeTask(path, block);
    FLY.txt.blur();
    assignBlock(path, block, v);
    focusBlock(block.id); return;
  }
  if (k === "org") {
    const cur = lineOrg(block);
    if (cur) block.title = trim(block.title.replace(new RegExp("\\[\\[o\\/" + cur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\]\\[[^\\]]*)?\\]\\]"), v ? "[[o/" + v + "]]" : "").replace(/\s{2,}/g, " "));
    else if (v) block.title = trim(block.title) + " [[o/" + v + "]]";
    createLinkedPages(block.title); touch(path); return flyAfter(k);
  }
  if (k === "proj") {
    flyMakeTask(path, block);
    const cur = lineProject(path, block);
    if (isJournalPath(path)) {
      if (cur && cur.ref) block.title = trim(block.title.replace(new RegExp("\\[\\[" + cur.ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\]\\[[^\\]]*)?\\]\\]", "i"), "").replace(/\s{2,}/g, " "));
      if (v) block.title = trim(block.title) + " [[" + pageRef(v) + "]]";
      touch(path); return flyAfter(k);
    }
    // On a page the project is the page, so another project means moving the line there.
    FLY.txt.blur();
    if (v && v !== path) refileBlock(path, block, v);
    else if (!v) unfileFromProject(path, block);
    return;
  }
  if (k === "rep" && v === "\u0002") {
    FLY.txt.blur();
    openRecurrenceDialog({title: "Repeats", spec: repeatOf(block), onSave: ({spec}) => {
      flyMakeTask(path, block);
      if (spec) setBlockProp(block, REPEAT_PROP, spec);
      else for (const key of Object.keys(block.props)) if (key.toLowerCase() === REPEAT_PROP) delete block.props[key];
      touch(path); render();
    }});
    return;
  }
  if (k === "rep") {
    flyMakeTask(path, block);
    if (v) setBlockProp(block, REPEAT_PROP, v);
    else for (const key of Object.keys(block.props)) if (key.toLowerCase() === REPEAT_PROP) delete block.props[key];
    touch(path); return flyAfter(k);
  }
}
