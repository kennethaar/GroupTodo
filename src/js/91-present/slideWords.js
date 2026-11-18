/* A line as a slide shows it: the words only. No task state, no contexts or
   project links, no estimate, no formatting marks (P12). */
function slideWords(b) {
  return plainTitle(b.title || "");
}
