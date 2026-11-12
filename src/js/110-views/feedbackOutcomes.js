/* Only the outcomes that fit the item: a project goes on, ends or waits; a
   to-do is finished, stays, waits or is cancelled. Something you wait for can
   also be taken back, to do yourself (#361). */
function feedbackOutcomes(f) {
  if (feedbackSubject(f).kind === "project") return ["continue", "close", "cancel", "someday"];
  return f.block.state === "WAIT"
    ? ["complete", "keep", "takeback", "someday", "cancel"]
    : ["complete", "keep", "someday", "cancel"];
}
/* The button says what you want, not what the app does (#361): Keep waiting
   on something you wait for, Keep it on your own to-do. */
function outcomeLabel(f, o) {
  if (o === "keep") return f.block.state === "WAIT" ? "Keep waiting" : "Keep it";
  return OUTCOME_LABEL[o];
}
