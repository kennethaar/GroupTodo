/* What is new, for a toast: each thing's first sentence, which says what it
   is. Its head only names where it lives ("A page"), so it says nothing alone. */
function newsHeads(entries) {
  return entries.flatMap(e => e.items).map(x => x.lead);
}
