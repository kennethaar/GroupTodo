function closeModal(opts = {}) {
  $("#modalRoot").textContent = "";
  MODAL_KEYS = null;
  // A list for a box that went with the dialog would float on by itself.
  if (SUGGEST && !SUGGEST.host.isConnected) suggestClose();
  usageDialogClosed();
  // Cleared before it runs: a dialog opened from inside the callback sets its own.
  const closer = MODAL_CLOSE;
  MODAL_CLOSE = null;
  if (closer) closer();
  if (!opts.keepQueue) {
    const after = MODAL_AFTER;
    MODAL_AFTER = null;
    if (after) setTimeout(after, 0);
  }
  /* Four of the tour's doors are dialogs rather than screens, so closing one is
     the moment that counts as coming back. Nothing happens unless a step is
     waiting, and the check stands down if anything else opens meanwhile. */
  if (typeof maybeAskTourCheckoff === "function") maybeAskTourCheckoff();
}
