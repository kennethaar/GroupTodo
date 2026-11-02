/* The same, for one of a block's body lines. */
function focusBodyLine(id, i, atEnd = true) {
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;
    const node = $(`.blk[data-id="${id}"] > .bodyline[data-bi="${i}"]`);
    if (!node) return;
    node.focus();
    const r = document.createRange(), s = getSelection();
    r.selectNodeContents(node); r.collapse(!atEnd);
    s.removeAllRanges(); s.addRange(r);
  });
}
