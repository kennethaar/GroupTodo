/* A task's words in a list: the sentence as it was written, @context and all,
   where it was written (#315). Only the project goes, because it is the line
   above or a chip of its own, and the estimate, which is its own badge. The
   context is ALSO the chip in front, so a list still scans by context. */
function titleForLine(title) {
  return trim(withoutEst(title)
    .replace(/\[\[[_0123]\/[^\]]+\]\]/g, "")
    .replace(/\s{2,}/g, " "));
}
