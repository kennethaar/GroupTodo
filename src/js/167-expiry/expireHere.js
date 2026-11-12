/* ============================================================
   167_EXPIRY -- Taskwarrior's until:
   A task with a date of its own to stop mattering says so on the task:

     until:: [[2026-11-01]]   after that day it is cancelled.
                              "Buy tickets until:fri" in the box at the top writes it.

   Nothing else is cancelled for being late. Late is a question for the weekly
   review, not for a rule that does not know why the task slipped.

   Cancelled, not deleted: the task stays where it was, struck out, with
   expired:: saying when, and one toast offers to put the lot back. Put back,
   a task is marked expire:: never, because "keep this" is an answer that has
   to outlive the next time the app opens.
   ============================================================ */
function expireHere(today) {
  const out = [];
  for (const a of leafActionsHere()) {
    const b = a.block;
    if (/^never$/i.test(trim(blockProp(b, "expire") || ""))) continue;
    const until = dateIn(blockProp(b, "until"));
    if (!until || until >= today) continue;
    const before = {state: b.state, props: Object.assign({}, b.props)};
    b.state = "CANCELLED";
    setBlockProp(b, "expired", "[[" + today + "]]");
    const me = stampName();
    if (me) setBlockProp(b, "done_by", me + " " + nowStamp());
    touch(a.path);
    out.push({path: a.path, block: b, before});
  }
  return out;
}
