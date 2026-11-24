/* A line as a slide shows it: the words only. No task state, no contexts or
   project links, no estimate, no formatting marks (P12; slideText() draws
   them, #477), and no slide
   layout mark (#433) or word (#481): "-> Q1" shows as "Q1". A link reads as its words
   (#454): a slide has no chips, so a project or person link is part of what
   the line says. A context is a tag and goes. */
function slideWords(b, keepMarks = false) {
  // A picture is not words (#488): it is drawn, as a slide's or a card's picture.
  // A reference or an embed reads as the line it points to (#470).
  const words = withoutEst(slideMark(slideWord(slideRefs(b.title)).rest).words).replace(/\[\[c\/[^\]]+\]\]/g, "")
    .replace(/\s*!\[[^\]]*\]\([^)\s]*\)\s*/g, " ").trim();
  return keepMarks ? linkWords(words) : withoutMarks(linkWords(words));
}
