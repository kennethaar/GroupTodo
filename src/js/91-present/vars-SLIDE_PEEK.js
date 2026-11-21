/* The slide preview on a Present button (#465), or null: its button, its
   choices and the one shown. SLIDE_LINE is the line you were last in, so
   ▶ Present can show where that line is in the talk. */
let SLIDE_PEEK = null;
let SLIDE_LINE = null;
document.addEventListener("focusin", e => {
  const b = e.target.closest && e.target.closest(".blk");
  if (b && b.dataset.id) SLIDE_LINE = b.dataset.id;
}, true);
