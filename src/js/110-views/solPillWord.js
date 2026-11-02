/* What letting go on a pill does, in a few words: "+ Tomas", "→ Waiting for". */
function solPillWord(box) {
  const a = SOL_ACTS.get(box.dataset.k);
  if (!a) return "";
  return a.input && SOL_DRAG ? "+ Drop to type" : a.word;
}
