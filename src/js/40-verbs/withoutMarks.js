/* The words of a line without Obsidian's formatting marks (#348): **bold**,
   __bold__, *italics*, _italics_, ==highlight== and ~~strike~~, and \* as a
   plain star. For wherever a title is plain text -- the verb check, a
   reminder, a mail -- so "**Call** the plumber" still starts with Call. The
   same rules as renderInline(): _ is not a mark inside a word, one ~ or = is
   not a mark at all. */
function withoutMarks(text) {
  const span = m => `([^${m}\\s](?:[^${m}]*[^${m}\\s])?)`;
  return String(text || "")
    .replace(new RegExp("\\*\\*\\*" + span("*") + "\\*\\*\\*", "g"), "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(new RegExp("(^|[^\\p{L}\\p{N}_])__" + span("_") + "__(?![\\p{L}\\p{N}_])", "gu"), "$1$2")
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1$2")
    .replace(new RegExp("(^|[^\\p{L}\\p{N}_/])_" + span("_") + "_(?![\\p{L}\\p{N}_])", "gu"), "$1$2")
    .replace(new RegExp("==" + span("=") + "==", "g"), "$1")
    .replace(new RegExp("~~" + span("~") + "~~", "g"), "$1")
    .replace(/\\([*_=~`])/g, "$1");
}
