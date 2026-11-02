const anyNudgeQuiet = () =>
  Object.keys(NUDGE_PLAIN).concat(["review"]).some(id => nudgeQuiet(id));
