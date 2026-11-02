/* "krrr" said in words: kg × 3 sets. */
function trackerKindWords(code) {
  code = code || "n";
  const reps = (code.match(/r/g) || []).length;
  if (/^kr+$/.test(code)) return "kg × " + reps + " set" + (reps === 1 ? "" : "s");
  if (/^r+$/.test(code)) return reps + " set" + (reps === 1 ? "" : "s") + " of reps";
  if (code.length === 1) return TRACKER_LETTERS[code].word;
  return code.split("").map(l => TRACKER_LETTERS[l].word).join(" · ");
}
