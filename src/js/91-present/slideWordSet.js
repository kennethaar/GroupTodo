/* A line with its slide layout word (#481) swapped for another's, or taken
   off when layout is null. The word goes behind a hidden line's "_ " (#467). */
function slideWordSet(title, layout) {
  const rest = slideWord(title).rest, hid = /^_\s+/.exec(rest)?.[0] || "";
  const word = layout && (SLIDE_WORDS.find(r => r[1] === layout) || [])[0];
  return word ? hid + "(" + word + ") " + rest.slice(hid.length) : rest;
}
