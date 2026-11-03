// Into row i of a block's table (-1 the header), the caret at offset at.
function tableFocusRow(b, i, at = 2) {
  TABLE_OPEN = b.id;
  focusLineAt(i < 0 ? `.blk[data-id="${b.id}"] .txt` : `.blk[data-id="${b.id}"] > .bodyline[data-bi="${i}"]`, at);
}
