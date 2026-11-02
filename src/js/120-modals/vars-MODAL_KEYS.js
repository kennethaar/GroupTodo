/* ============================================================
   120_MODALS
   Port of: init.lua 80_RENDER_ENGINE (open_scratch + letter keys)
   The bottom-split scratch buffers become bottom sheets; the a-z
   selection keys from open_context_picker are kept exactly.
   ============================================================ */
let MODAL_KEYS = null;

/* Something to ask once the dialog on screen has been dealt with. One dialog
   replaces another, so a run of questions -- eight tasks ticked at once, three
   of them repeating -- has to be asked one at a time or all but the last are
   thrown away unanswered. */
let MODAL_AFTER = null;
/* A dialog can also be left rather than answered -- the X, the scrim, or another
   dialog taking its place. Anything that has to know which of the two happened
   hands modal() an onClose; it fires exactly once, after the dialog is gone. */
let MODAL_CLOSE = null;
