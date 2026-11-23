/* Obsidian's marks (#348) in text already escaped as HTML: **bold**, __bold__,
   *italics*, _italics_, ==highlight== and ~~strike~~. What is between them
   cannot run into a tag or an attribute, and _ and __ are not read inside a
   word, so file_name_v2 stays as written. One ~ or = is not a mark: ~5 min,
   a tracker's =12. For a line in the outline and on a slide (#477). */
function inlineMarks(h) {
  const span = m => `([^${m}\\s<>"](?:[^${m}<>"]*[^${m}\\s<>"])?)`;
  return h
    .replace(new RegExp("\\*\\*\\*" + span("*") + "\\*\\*\\*", "g"), "<b><i>$1</i></b>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(new RegExp("(^|[^\\p{L}\\p{N}_])__" + span("_") + "__(?![\\p{L}\\p{N}_])", "gu"), "$1<b>$2</b>")
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>")
    .replace(new RegExp("(^|[^\\p{L}\\p{N}_/])_" + span("_") + "_(?![\\p{L}\\p{N}_])", "gu"), "$1<i>$2</i>")
    .replace(new RegExp("==" + span("=") + "==", "g"), "<mark>$1</mark>")
    .replace(new RegExp("~~" + span("~") + "~~", "g"), "<s>$1</s>");
}
