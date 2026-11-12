/* Feedback is handled by an outcome on what it is about, and by nothing else.
   Continue needs a next action: the one there is kept, or edited, or a new one
   is written. Keep may change the to-do's words and date. The outcome goes on
   the comment, with who chose it and when. False when nothing was decided. */
function decideFeedback(f, outcome, {next, due} = {}) {
  if (!feedbackOutcomes(f).includes(outcome)) return false;
  const s = feedbackSubject(f);
  return inSpace(f.space, () => {
    let said = OUTCOME_LABEL[outcome];
    const words = trim(next || "");
    if (outcome === "continue") {
      let step = projectNextAction(s.project);
      const text = words || (step ? step.title : "");
      if (!text) return false;
      if (!step) step = addNextActionTo(s.project, text);
      else if (step.title !== text) step.title = text;
      if (due !== undefined) setDue(step, due || null);
      touch(s.project);
      if (statusDirOf(s.project) !== "1") setProjectStatus(s.project, "1", {ask: false});
      said += ": " + plainTitle(text);
    } else if (s.kind === "project") {
      setProjectStatus(s.project, {close: "0", cancel: "-", someday: "2"}[outcome], {ask: false});
    } else if (outcome === "keep" || outcome === "takeback") {
      if (words && words !== f.block.title) { f.block.title = words; said += ": " + plainTitle(words); }
      if (due !== undefined) setDue(f.block, due || null);
      // Taken back, it is yours to do again, not something you wait for (#361).
      if (outcome === "takeback") setBlockState(f.path, f.block, "TODO");
      touch(f.path);
    } else if (outcome === "someday") clSomeday(f.path, f.block);
    else setBlockState(f.path, f.block, outcome === "complete" ? "DONE" : "CANCELLED");
    feedbackSubject(f);
    // Answered: there is no unanswered question left to chase.
    dropProp(f.block, ASKED_PROP);
    setBlockProp(f.msg, HANDLED_PROP, (whoAmI() || "Someone") + " " + nowStamp());
    setBlockProp(f.msg, DECIDED_PROP, said);
    touch(f.path);
    return true;
  });
}
