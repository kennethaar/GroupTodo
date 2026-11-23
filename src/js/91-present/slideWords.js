/* A line as a slide shows it: the words only. No task state, no contexts or
   project links, no estimate, no formatting marks (P12; slideText() draws
   them, #477), and no slide
   layout mark (#433): "-> Q1" shows as "Q1". A link reads as its words
   (#454): a slide has no chips, so a project or person link is part of what
   the line says. A context is a tag and goes. */
function slideWords(b, keepMarks = false) {
  const words = withoutEst(slideMark(b.title || "").words).replace(/\[\[c\/[^\]]+\]\]/g, "");
  return keepMarks ? linkWords(words) : withoutMarks(linkWords(words));
}
