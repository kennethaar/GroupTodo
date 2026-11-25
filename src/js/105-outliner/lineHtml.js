/* A line as the outline draws it when you are not typing in it: a task's
   time as its dots, everything else as written. Focus puts the raw
   title back, #30m and all. */
/* The words as written, @context where it was typed (#315). A slide
   layout word is not shown: the bullet is its icon (#481). */
function lineHtml(b) {
  if (tableRows(b)) return tableHtml(b);
  // A hidden line's "_ " is storage (P12): the closed eye in front says it (#467).
  const t = b.state ? slideWord(b.title).rest : slideWord(b.title).rest.replace(/^_\s+/, "");
  if (bujoKind(t, b.state)) return renderInline(bujoText(t));
  return b.state && estBand(t)
    ? estHtml(t) + renderInline(withoutEst(t))
    : renderInline(headLevel(t, b.state) ? t.replace(HEAD_RE, "")
      : isQuoteLine(t, b.state) ? t.replace(QUOTE_RE, "") : t);
}
