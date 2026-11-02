/* The line with its markup taken off: no state word, no links it already
   carries, no leading dash somebody typed out of habit. What is left is what
   the line is called, and it is what a new page gets named. */
function bareLineName(block) {
  let t = String(block.title || "");
  t = t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[[^\]]+\]\[([^\]]*)\]\]/g, "$1").replace(/\[\[[^\]]*\]\]/g, " ");
  t = splitState(t)[1];
  t = t.replace(/^[-*•]\s+/, "").replace(/\s+/g, " ");
  return trim(t).replace(/[.,;:!?]+$/, "");
}
