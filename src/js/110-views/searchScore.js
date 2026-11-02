/* The score of a whole query against a text, 0 unless every word is in it. */
function searchScore(terms, phrase, text) {
  const lower = String(text || "").toLowerCase();
  const words = searchWords(lower);
  let total = 0;
  for (const w of terms) {
    const s = wordScore(w, lower, words);
    if (!s) return 0;
    total += s;
  }
  // The words together, as typed, beat the same words scattered.
  if (terms.length > 1 && lower.includes(phrase)) total += 3;
  return total;
}
