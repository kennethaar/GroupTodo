/* The date input lies invisible over its chip; Chromium only opens the
   calendar from its own icon, so a click anywhere on the chip asks for it. */
document.addEventListener("click", e => {
  const i = e.target.closest && e.target.closest(".datepick input[type=date]");
  if (i) try { i.showPicker(); } catch (_) {}
});
document.addEventListener("pointerup", () => solDragEnd(true));
document.addEventListener("pointercancel", () => solDragEnd(false));
