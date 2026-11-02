/* What a box or one of its pills does when it is taken, by drop or by key. */
/* What a box does when it is taken, by drop, click or key. One that only
   opens something (a box to write in, the calendar, the whole list) is not
   an answer yet, so it is not what goes onto the pile. */
function solTake(r, box) {
  if (SOL.moving) return;
  const a = r && box && SOL_ACTS.get(box.dataset.k);
  if (!a) return;
  if (!a.stay) SOL.took = a.k;
  a.take();
}
