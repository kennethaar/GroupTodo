/* A line as a slide shows it: the words only. No task state, no contexts or
   project links, no estimate, no formatting marks (P12), and no slide
   layout mark (#433): "-> Q1" shows as "Q1". */
function slideWords(b) {
  return plainTitle(slideMark(b.title || "").words);
}
