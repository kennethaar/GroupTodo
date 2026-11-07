/* A line as the outline draws it when you are not typing in it: a task's
   time as its dots, everything else as written. Focus puts the raw
   title back, #30m and all. */
/* The words as written, @context where it was typed (#315). */
function lineHtml(b) {
  if (tableRows(b)) return tableHtml(b);
  if (bujoKind(b.title, b.state)) return renderInline(bujoText(b.title));
  return b.state && estBand(b.title)
    ? estHtml(b.title) + renderInline(withoutEst(b.title))
    : renderInline(headLevel(b.title, b.state) ? b.title.replace(HEAD_RE, "") : b.title);
}
