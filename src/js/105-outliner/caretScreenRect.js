/* ============================================================
   [[ OPENS A LIST OF PAGES
   The prefix in a link is the folder it lives in, so [[c/ can only mean a
   context and [[p/ can only mean a person. That is knowledge the app already
   has and the person typing should not have to carry: having to remember which
   letter goes with which folder, and then whether you spelled the page the same
   way as last time, is exactly the work a list on screen exists to take away.

   It writes nothing by itself. Accepting a row inserts the same [[ref]] you
   could have typed, and the page it points at is created on blur by the same
   createLinkedPages the outliner already ran, so a link to something that does
   not exist yet still works the way it always did.
   ============================================================ */
/* Where the caret is on screen, for hanging the list under it. A collapsed
   caret at a text boundary has no rectangle in Chrome, so fall back to the
   field itself rather than putting the list in the corner. */
function caretScreenRect(host) {
  const sel = getSelection();
  if (host.isContentEditable && sel && sel.rangeCount && host.contains(sel.anchorNode)) {
    const r = sel.getRangeAt(0).getClientRects()[0];
    if (r && (r.width || r.height || r.top)) return r;
  }
  return host.getBoundingClientRect();
}
