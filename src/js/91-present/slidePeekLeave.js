/* The pointer left the button or the preview (#465): it goes a moment later,
   so the pointer can move over to its choices. Not while the button, or
   the menu row picked with the arrows, keeps it. */
function slidePeekLeave(keep = false) {
  const P = SLIDE_PEEK;
  if (!P || keep || document.activeElement === P.anchor) return;
  clearTimeout(P.timer);
  P.timer = setTimeout(() => {
    if (SLIDE_PEEK === P && !P.peek.matches(":hover")) slidePeekHide();
  }, 200);
}
