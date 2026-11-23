/* A Slide layout pick from the line tools (#433): a line with lines gets
   the layout word (#481); a line with none is marked itself
   (editBarSlideLines). The caret stays in the line. */
function editBarSlideLayout(lay) {
  if (!FLY) return;
  const {txt, path, block: b} = FLY;
  const top = txt.getBoundingClientRect().top;
  txt.blur();                        // the words typed so far are kept first
  if (!getPage(path)) return;
  slideLayoutPick(path, editBarSlideLines(b), lay, () => focusBlock(b.id));
  editBarRefocus(b.id, top);
}
