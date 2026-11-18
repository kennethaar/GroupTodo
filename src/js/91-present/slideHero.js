/* A quote slide's line (#433): the quote, who said it and the takeaways.
   The author is a trailing "-- Author" or "— Author", else the quote's first
   line; its other lines are takeaways, one → each. */
function slideHero(b) {
  const lines = (b.children || []).filter(k => slideWords(k));
  let quote = slideWords(b), author = "";
  const m = /\s+(?:--|—)\s*([^"“”]+)$/.exec(quote);
  if (m) { author = trim(m[1]); quote = trim(quote.slice(0, m.index)); }
  quote = quote.replace(/^["“”]([^"“”]+)["“”]$/, "$1");
  const takeaways = author ? lines : lines.slice(1);
  if (!author && lines[0]) author = slideWords(lines[0]);
  return {quote, author, takeaways};
}
