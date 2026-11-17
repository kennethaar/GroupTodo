// The tip's example as it ends (#427): what a redraw, and reduced motion, show.
function meetingTipFinal() {
  const s = {lines: [], caption: "", n: 0, popup: null, done: true};
  for (const op of MEETING_DEMO) meetingTipApply(s, op);
  return s;
}
