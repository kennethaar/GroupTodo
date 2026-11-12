function clAnswer(r, ans) {
  const {path, block: b} = r;
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
  if (dayCandidate(b)) clDeal(path, b);
  touch(path);
  clStampIfDone(path);
  render();
}
