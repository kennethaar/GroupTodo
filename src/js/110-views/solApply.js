function solApply(r, f, v) {
  if (f.type !== "multi") SOL.more = null;    // one answer: the long list has done its job
  if (f.type === "multi") { if (v === "none") f.clear(r); else { f.toggle(r, v); delete solAns(r)[f.k]; } }
  else f.pick(r, v);
  /* The status is one field like the others: the card ends only once every
     field is answered, or when it is skipped -- except Completed and Cancelled,
     which leave nothing more to ask, so they end the review there. Waiting is
     waiting on somebody, so that asks who first. */
  if (f.k === "status" && !SOL_EDIT) {
    if (v === "0" || v === "-") { solOp(r, "done"); return; }
    if (v === "3") { solAskWaiting(r, () => solAfter(r, f.k)); return; }
  }
  solAfter(r, f.k, f.type === "multi" && v !== "none");
}
