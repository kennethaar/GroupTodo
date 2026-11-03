/* The chapter's own line moves, so anything written under it goes along. It
   lands where chapter j was: after it going down, before it going up. */
function moveBookChapterTo(i, j) {
  const ch = bookChapters(), page = bookPage();
  if (i === j || !ch[i] || !ch[j]) return;
  page.blocks.splice(page.blocks.indexOf(ch[i].block), 1);
  const at = page.blocks.indexOf(ch[j].block);
  page.blocks.splice(j > i ? at + 1 : at, 0, ch[i].block);
  saveBook();
}
