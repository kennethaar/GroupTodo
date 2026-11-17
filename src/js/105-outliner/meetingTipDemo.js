/* Plays the tip's example into host (#427), a letter at a time, the popup
   held long enough to read, each caption long enough to take in. A newer run,
   Replay, takes over; a redraw of the tip hands the run its new box.
   opts.delay scales every pause (0 for tests); opts.onStep sees each state. */
async function meetingTipDemo(host, opts = {}) {
  const delay = opts.delay ?? 1;
  const run = MEETING_DEMO_RUN = {host, s: {lines: [], caption: "", n: 0, popup: null}};
  MEETING_DEMO_PLAYED = true;
  const live = () => MEETING_DEMO_RUN === run;
  const wait = ms => new Promise(r => setTimeout(r, ms * delay));
  const show = () => { meetingTipDraw(run.host, run.s); if (opts.onStep) opts.onStep(run.s); };
  for (const op of MEETING_DEMO) {
    if (op.type) {
      for (const ch of op.type) {
        if (!live()) return;
        meetingTipApply(run.s, {type: ch});
        show();
        await wait(38);
      }
      continue;
    }
    if (!live()) return;
    if (op.pop) { run.s.popup = op.pop; show(); await wait(900); if (!live()) return; }
    meetingTipApply(run.s, op);
    show();
    await wait(op.cap ? 1300 : op.st ? 550 : 250);
  }
  if (!live()) return;
  run.s.done = true;
  show();
  MEETING_DEMO_RUN = null;
}
