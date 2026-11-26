/* One answer for every line picked in the day page (#460), and one Undo that
   takes the whole group back. The card's own line is asked after, unless it
   was picked too. */
function clAnswerMany(r, picks, ans) {
  if (ans.one) { notify(ans.label + " takes one line at a time.", "warn"); return; }
  const {path} = r;
  CL.undos.push({path, snap: structuredClone(getPage(path)), dealt: [...clDealt()],
    title: plainTitle(bujoText(picks[0].title)) + " + " + (picks.length - 1), label: ans.label});
  if (CL.undos.length > 30) CL.undos.shift();
  lineSelClear();
  CL.aim = 0;
  const done = () => {
    for (const k of picks) { CL.skip.delete(clKey(path, k)); clDeal(path, k); }
    touch(path);
    clStampIfDone(path);
    render();
  };
  if (ans.cheer) cheer();
  if (ans.many) { ans.many(path, picks, done); return; }
  for (const k of picks) ans.run(path, k);
  done();
}
