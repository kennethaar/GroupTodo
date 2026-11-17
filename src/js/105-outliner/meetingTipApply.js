/* One step of the tip's example (#427) applied to its state
   {lines: [{ind, st, text}], caption, n, popup}. */
function meetingTipApply(s, op) {
  const cur = s.lines[s.lines.length - 1];
  if (op.cap) { s.caption = (op.key ? op.key + ": " : "") + op.cap; s.n++; }
  else if (op.nl != null) s.lines.push({ind: op.nl, st: "", text: ""});
  else if (op.type) cur.text += op.type;
  else if (op.pick) { cur.text = cur.text.slice(0, cur.text.length - op.q.length) + op.pick; s.popup = null; }
  else if (op.st) cur.st = op.st;
  return s;
}
