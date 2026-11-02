/* A line as the outline draws it when you are not typing in it: a task's
   time as its dots, everything else as written. Focus puts the raw
   title back, #30m and all. */
/* On the Journal's day page (lead) a task's context at the end of the line is
   drawn in front of its words, by the state; the file keeps it where it is (#160). */
function lineHtml(b, lead) {
  const tail = lead && b.state ? CTX_TAIL_RE.exec(withoutEst(b.title)) : null;
  if (tail) return renderInline(trim(tail[1])) + " " + estHtml(b.title) + renderInline(trim(withoutEst(b.title).slice(0, tail.index)));
  if (bujoKind(b.title, b.state)) return renderInline(bujoText(b.title));
  return b.state && estTier(b.title)
    ? estHtml(b.title) + renderInline(withoutEst(b.title))
    : renderInline(headLevel(b.title, b.state) ? b.title.replace(HEAD_RE, "") : b.title);
}
