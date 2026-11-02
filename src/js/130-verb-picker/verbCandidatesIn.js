/* The words of the task that could be the action, minus the ones the lexicon
   already knows and the scaffolding that is never a verb. */
function verbCandidatesIn(title) {
  const plain = plainTitle(title || "");
  const seen = new Set();
  const out = [];
  for (const raw of plain.split(/[^\p{L}\p{M}\-]+/u)) {
    const w = trim(raw);
    /* Three letters and up. Teaching "om" or "av" as a verb would make every
       line that happens to start with a preposition pass the check, which is
       worse than leaving the handful of two letter verbs ("be", "se") to the
       add box below. */
    if (w.length < 3) continue;
    const low = w.toLowerCase();
    if (seen.has(low) || VERB_LOOKUP[low]) continue;
    seen.add(low);
    out.push(w);
  }
  return out.slice(0, 8);
}
