/* alt-c, and the menu row. Three ways it can go, in this order:

   A line of one word is that word -- somebody typed "errand" on its own and
   meant the context, and there is nothing else it could have meant, so the
   line becomes the link.

   Otherwise the word the caret is after becomes the context, in place, where
   it was typed. Nothing is appended and nothing is retyped.

   And with neither -- the "..." menu on a long line, a caret sitting on
   punctuation -- the context picker, which is where this always went.

   The first two write without asking, because asking about one word costs
   more than the mistake does; the toast carries the way back. */
function makeContextFromLine(path, block, at) {
  if (hasContextLink(block.title)) { notify("Already has a context."); return; }
  const bare = bareLineName(block);
  const oneWord = !!bare && !/\s/.test(bare);
  const word = oneWord ? bare : (at && at.word);
  if (!word) { promptAndInsertContext(path, block); return; }

  const known = contextList().some(c => c.toLowerCase() === word.toLowerCase());
  const was = block.title;
  const ctx = slugify(word);
  if (oneWord) {
    insertMakeLink(path, block, "c/" + ctx);             // the line becomes the link
  } else {
    block.title = block.title.slice(0, at.start) + "[[c/" + ctx + "]]" + block.title.slice(at.end);
    createLinkedPages(block.title);
    touch(path);
    render();
  }
  notify("@" + ctx + (known ? "" : " \u00B7 a new context"), "info",
    {label: "undo", run: () => { block.title = was; touch(path); render(); }});
}
