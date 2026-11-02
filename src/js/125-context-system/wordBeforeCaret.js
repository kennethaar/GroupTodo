/* The word the caret is sitting after, with where it is in the line. A context
   is one word -- phone, errand, deep-work -- so the word under the hand is the
   whole answer, and taking it from there means a line can say "ring the
   plumber phone" and come out reading like a sentence with a context on it
   rather than a sentence with a word left over. */
function wordBeforeCaret(host) {
  const before = host ? textBeforeCaret(host) : null;
  if (before == null) return null;
  const m = /([\p{L}\p{N}][\p{L}\p{N}'\u2019._-]*)(\s*)$/u.exec(before);
  if (!m) return null;
  const end = before.length - m[2].length;
  const start = end - m[1].length;
  // Not a word that is already inside a [[link]]: that is markup, not a word.
  const head = before.slice(0, start);
  if (head.lastIndexOf("[[") > head.lastIndexOf("]]")) return null;
  return {word: m[1], start, end};
}
