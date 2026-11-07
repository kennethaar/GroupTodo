/* Turns one of a page's Hide done switches (#321), written on the page itself.
   A day's Linked References can be drawn for another area's column, so the
   write goes to the area the page is in. */
function setDoneHidden(path, part, on, space) {
  inSpace(space, () => {
    const page = getPage(path);
    if (!page) return;
    const props = page.props || (page.props = {});
    const parts = ["page", "links"].filter(p => p === part ? on : doneHidden(path, p));
    if (parts.length) props[HIDE_DONE_PROP] = parts.join(", "); else delete props[HIDE_DONE_PROP];
    touch(path);
  });
  render();
}
