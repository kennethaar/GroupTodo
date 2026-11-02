/* From render(): the screen may have changed, or only been drawn again. */
function usageNoteView() {
  USAGE.view = usageViewPlace();
  if (!USAGE.dialog) usageArrive(USAGE.view);
}
