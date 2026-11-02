/* ---------- the ask ----------
   One prompt, and only when the answer has changed since the last time: a
   newcomer who says "not yet" to three steps must not be asked a fourth time
   about the same three. */
const tourAskKey = steps => steps.map(s => s.dest).sort().join(",");
