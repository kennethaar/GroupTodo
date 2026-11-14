function flyHead(k) {
  if (!FLY) return;
  const {path, block} = FLY;
  /* Off the line first: losing focus writes the line's words back, and a
     [[1/…]] written back over a project made into a task brings its page back. */
  if (k === "kind") { flyCommit(); const b = block; FLY.txt.blur(); if (!projectLineToTask(path, b)) setBlockState(path, b, b.state ? null : "TODO"); focusBlock(b.id); return; }
  if (k === "mkproj") { flyCommit(); const b = block; FLY.txt.blur(); makeFromLine(path, b, "project"); return; }
  if (k === "mkzet") { flyCommit(); const b = block; FLY.txt.blur(); makeFromLine(path, b, "zettel"); return; }
  if (k === "ttype") { flyCommit(); const b = block; FLY.txt.blur(); openTaskTypePicker(path, b); return; }
  if (k === "mkarea") { flyCommit(); const b = block; FLY.txt.blur(); areaFromLine(path, b); return; }
  if (k === "more") { flyCommit(); const b = block; FLY.txt.blur(); openTaskDetail(path, b); return; }
  if (k === "meet") { flyCommit(); const b = block; FLY.txt.blur(); openMeetingForm(path, b); return; }
  if (k === "trk") { flyCommit(); const b = block; FLY.txt.blur(); openTrackerPicker((title, when) => insertTracker(path, b, title, when), path, {path, block: b}); return; }
  if (k === "refile") { flyCommit(); const b = block; FLY.txt.blur(); openRefile(path, b); return; }
  if (k === "aiplan") { flyCommit(); const b = block; FLY.txt.blur(); openPlanWithAI(planSourceOfLines(path, [b])); return; }
  if (k === "embedref") { flyCommit(); const b = block; FLY.txt.blur(); copyEmbedOf(path, b); return; }
  if (k === "delasset") { flyCommit(); const b = block; FLY.txt.blur(); deleteAssetPrompt(path, b); return; }
  if (k === "plaincopy") { flyCommit(); const b = block; FLY.txt.blur(); copyPlainOf(b); return; }
  if (k === "tell") { flyCommit(); const b = block; FLY.txt.blur(); informFromLine(path, b); return; }
  if (k === "ask") {
    flyCommit();
    const ps = linePeople(block);
    if (!ps.length) return;
    if (ps.length === 1) { const b = block; FLY.txt.blur(); openAskForUpdate(ps[0], b); return; }
  }
  FLY.open = FLY.open === k ? null : k;
  FLY.hi = 0; FLY.q = "";
  FLY.sel = FLY.open && TAG_SEL_PREFIX[k] ? flySelWords(FLY.txt) : null;
  flyDraw();
}
