// Quick's answers (#523): note, todo, or skip to the back of the deck.
function qcTake(what) {
  const r = CL.shown;
  if (!r) return;
  CL.editing = null;
  if (what === "skip") { clSkip(r); return; }
  clAnswer(r, CL_ANSWERS.find(a => a.label === (what === "todo" ? "To do" : "Leave it as a note")));
}
