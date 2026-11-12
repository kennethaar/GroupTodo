/* Engage (#360): Focus in Next deals the context's next actions one at a
   time. null when off; otherwise the context, the actions dealt this round
   (done or skipped, by engageKey), the skipped ones and how many were done. */
let ENGAGE = null;
const engageKey = a => (a.space || V.space) + "|" + a.block.id;
// Enter is Done, the right arrow Skip. Letters stay free (P6).
document.addEventListener("keydown", e => {
  if (!ENGAGE || state.view !== "next" || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
  const t = e.target;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  const btn = e.key === "ArrowRight" ? $(".engage-skip")
    : e.key === "Enter" && !(t && t.closest && t.closest("button")) ? $(".engage-done") : null;
  if (!btn) return;
  e.preventDefault();
  btn.click();
});
