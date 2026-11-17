function focusBlock(id, atEnd = true) {
  /* A line in Linked References is drawn a moment after the page (#425), so
     one not there yet is looked for again once that has happened. */
  const place = tries => {
    if ($("#modalRoot").firstChild) return;   // a picker opened on the way; it owns the keys
    const node = $(`.blk[data-id="${id}"] .txt`);
    if (!node) { if (tries) setTimeout(() => requestAnimationFrame(() => place(tries - 1)), 0); return; }
    node.focus();
    const r = document.createRange(), s = getSelection();
    r.selectNodeContents(node); r.collapse(!atEnd);
    s.removeAllRanges(); s.addRange(r);
  };
  requestAnimationFrame(() => place(2));
}
