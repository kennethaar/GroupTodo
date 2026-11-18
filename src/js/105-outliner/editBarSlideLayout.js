/* A Slide layout pick from the line tools (#433): it marks the line's lines,
   or the line itself (editBarSlideLines). The caret stays in the line. */
function editBarSlideLayout(lay) {
  if (!FLY) return;
  const {txt, path, block: b} = FLY;
  const top = txt.getBoundingClientRect().top;
  txt.blur();                        // the words typed so far are kept first
  if (!getPage(path)) return;
  slideLayoutPick(path, editBarSlideLines(b), lay, () => focusBlock(b.id));
  editBarRefocus(b.id, top);
}
