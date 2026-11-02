/* No header: the mail already says who and when, and each task knows who it
   is waiting on. The --- lines fence off what the importer reads. The numbers
   run on across both lists, so "3" means one thing in their answer. */
function askItemsMarkdown(items, recipient) {
  const t = ASK_NOTE[askLang()], k = askKinds(items);
  let n = 0;
  const list = group => group.map(i => askItemMarkdown(i, recipient, ++n)).join("\n\n");
  return [
    "---",
    // Both kinds in one mail get a heading each; one kind needs none.
    ...(k.q && k.w
      ? [t.waitHead, "", list(items.filter(i => !i.q)), "", t.askHead, "", list(items.filter(i => i.q))]
      : [list(items)]),
    "---",
  ].join("\n");
}
