/* Only the outcomes that fit the item: a project goes on, ends or waits; a
   to-do stays, is finished, is dropped or waits. */
function feedbackOutcomes(f) {
  return feedbackSubject(f).kind === "project"
    ? ["continue", "close", "cancel", "someday"]
    : ["keep", "complete", "cancel", "someday"];
}
