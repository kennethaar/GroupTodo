/* A key that opens a dialog from a line being written hands the caret back
   when the last dialog closes, picked or cancelled, so typing goes on without
   a click (#412). One dialog can lead to the next (a project's name, then its
   outcome), so it waits again while any is open. */
function caretBackAfterDialogs(id) {
  const back = () => {
    if ($("#modalRoot").firstChild) { if (!MODAL_AFTER) MODAL_AFTER = back; return; }
    focusBlock(id);
  };
  if ($("#modalRoot").firstChild) { if (!MODAL_AFTER) MODAL_AFTER = back; }
  else back();
}
