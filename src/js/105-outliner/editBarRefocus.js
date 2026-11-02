/* Back into the line straight away, while the tap is still the tap: a phone
   only lets a tap bring the keyboard up, and a focus a frame later found the
   keyboard gone and the page scrolled off to the top. And not the browser's
   scrolling the line into view, but the line kept where it was on the screen,
   so a line moved down does not drag the page along with it. */
function editBarRefocus(id, top) {
  const node = $(`.blk[data-id="${id}"] .txt`);
  if (!node || $("#modalRoot").firstChild) return;
  if (document.activeElement !== node) {
    node.focus({preventScroll: true});
    const r = document.createRange(), sel = getSelection();
    r.selectNodeContents(node); r.collapse(false);
    sel.removeAllRanges(); sel.addRange(r);
  }
  const c = $("#content"), dy = node.getBoundingClientRect().top - top;
  if (c && dy) c.scrollTop += dy;
}
