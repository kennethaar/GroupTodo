/* A dialog is a place of its own while it is open, but only by a title the app
   wrote. "Vault & sync - Work" counts as Vault & sync; a title with a page or a
   person in it counts as the screen behind it rather than carry the name. */
function usageNoteDialog(title) {
  const t = String(title || ""), known = new Set(LANG_CATALOG.s);
  const name = known.has(t) ? t : known.has(t.split(" - ")[0]) ? t.split(" - ")[0] : "";
  USAGE.dialog = name ? "dialog/" + name.replace(/[,·]/g, " ").replace(/\s+/g, " ") : null;
  // The same dialog drawn again in place -- the next card of a review -- is the same visit.
  if (USAGE.dialog && USAGE.dialog === USAGE.closed) USAGE.place = USAGE.dialog;
  USAGE.closed = null;
  usageArrive(USAGE.dialog || USAGE.view);
}
