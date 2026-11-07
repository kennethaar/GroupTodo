/* A task's words in a list: the sentence as it was written, @context and all,
   where it was written (#315). Only the project goes, because it is the line
   above or a chip of its own, and the estimate, which is its own badge. */
function titleForLine(title) {
  return trim(withoutEst(title)
    .replace(/\[\[[_0123]\/[^\]]+\]\]/g, "")
    .replace(/\s{2,}/g, " "));
}
