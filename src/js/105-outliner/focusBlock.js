function focusBlock(id, atEnd = true) {
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;   // a picker opened on the way; it owns the keys
    const node = $(`.blk[data-id="${id}"] .txt`);
    if (!node) return;
    node.focus();
    const r = document.createRange(), s = getSelection();
    r.selectNodeContents(node); r.collapse(!atEnd);
    s.removeAllRanges(); s.addRange(r);
  });
}
