/* A line as the outline draws it when you are not typing in it: a task's
   time as its dots, everything else as written. Focus puts the raw
   title back, #30m and all. */
/* On the Journal's day page (lead) a task's context also stands in front of
   its words, by the state, as it does in every list; the words keep it where
   it was written (#160, #315). */
function lineHtml(b, lead) {
  if (tableRows(b)) return tableHtml(b);
  const ctx = lead && b.state ? contextOf(withoutEst(b.title)) : null;
  if (ctx) return '<span class="chip ctx" aria-hidden="true">@' + esc(ctx) + "</span> " + lineHtml(b, false);
  if (bujoKind(b.title, b.state)) return renderInline(bujoText(b.title));
  return b.state && estBand(b.title)
    ? estHtml(b.title) + renderInline(withoutEst(b.title))
    : renderInline(headLevel(b.title, b.state) ? b.title.replace(HEAD_RE, "") : b.title);
}
