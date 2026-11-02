/* A date at the very end of a line: "Call Mia friday", "Send the draft in 2
   weeks". Only the end, because a date in the middle of a sentence is usually
   part of the sentence: "agree the Monday meeting" is not due on Monday. */
function trailingDate(text) {
  const t = String(text || "");
  const words = t.split(/(\s+)/);
  for (let n = Math.min(5, Math.ceil(words.length / 2)); n >= 1; n--) {
    const tail = words.slice(words.length - (2 * n - 1)).join("");
    const iso = dateFromWords(tail);
    if (!iso) continue;
    const start = t.length - tail.length;
    if (start > 0 && !/\s$/.test(t.slice(0, start))) continue;
    if (start === 0) return null;           // the whole line is a date: that is a note, not a due date
    return {start, iso, phrase: tail};
  }
  return null;
}
