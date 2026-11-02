function clAnswer(r, ans) {
  const {path, block: b} = r;
  CL.undo = {path, snap: structuredClone(getPage(path)), dealt: [...clDealt()]};
  CL.skip.delete(clKey(path, b));
  CL.aim = 0;
  if (ans.box) {
    CL.pending = {path, id: b.id, title: b.title, state: b.state};
    ans.run(path, b);
    return;
  }
  ans.run(path, b);
  if (dayCandidate(b)) clDeal(path, b);
  touch(path);
  clStampIfDone(path);
  render();
}
