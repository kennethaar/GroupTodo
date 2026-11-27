function clAnswer(r, ans) {
  const {path, block: b} = r, picks = clPicked(r);
  if (picks.length > 1) { clAnswerMany(r, picks, ans); return; }
  // One line picked in the day page: the answer is for that line.
  if (picks.length) { lineSelClear(); if (picks[0] !== b) { clAnswer({path, block: picks[0], trail: []}, ans); return; } }
  CL.undos.push({path, snap: structuredClone(getPage(path)), dealt: [...clDealt()],
    title: plainTitle(bujoText(b.title)), label: ans.label});
  if (CL.undos.length > 30) CL.undos.shift();
  CL.skip.delete(clKey(path, b));
  CL.aim = 0;
  if (ans.box) {
    CL.pending = {path, id: b.id, title: b.title, state: b.state};
    ans.run(path, b);
    return;
  }
  ans.run(path, b);
  if (ans.cheer) cheer();
  if (dayCandidate(b)) clDeal(path, b);
  touch(path);
  clStampIfDone(path);
  render();
}
