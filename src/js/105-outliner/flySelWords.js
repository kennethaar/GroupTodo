/* The words selected in the line, when Tag is asked for with some: they are
   the name to link (#335). Only plain words count -- not a whole link, not
   part of one, not several lines' worth. */
function flySelWords(txt) {
  if (!txt) return null;
  const [a, b] = caretOffsets(txt);
  const all = hostText(txt) || "", raw = all.slice(a, b);
  const text = trim(raw);
  if (!text || text.length > 60 || /[\n\[\]]/.test(text)) return null;
  // Inside a link the words belong to it already.
  const before = all.slice(0, a);
  if (before.lastIndexOf("[[") > before.lastIndexOf("]]")) return null;
  const from = a + (raw.length - raw.trimStart().length);
  return {from, to: from + text.length, text};
}
