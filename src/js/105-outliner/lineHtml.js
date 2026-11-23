/* A line as the outline draws it when you are not typing in it: a task's
   time as its dots, everything else as written. Focus puts the raw
   title back, #30m and all. */
/* The words as written, @context where it was typed (#315). A slide
   layout word is not shown: the bullet is its icon (#481). */
function lineHtml(b) {
  if (tableRows(b)) return tableHtml(b);
  const t = slideWord(b.title).rest;
  if (bujoKind(t, b.state)) return renderInline(bujoText(t));
  return b.state && estBand(t)
    ? estHtml(t) + renderInline(withoutEst(t))
    : renderInline(headLevel(t, b.state) ? t.replace(HEAD_RE, "")
      : isQuoteLine(t, b.state) ? t.replace(QUOTE_RE, "") : t);
}
