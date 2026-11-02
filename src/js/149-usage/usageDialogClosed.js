/* Back to the screen behind it, which was never left, so not a new visit. */
function usageDialogClosed() {
  if (!USAGE.dialog) return;
  USAGE.closed = USAGE.dialog;
  USAGE.dialog = null;
  USAGE.place = USAGE.view;
  setTimeout(() => { USAGE.closed = null; }, 0);
}
