/* Take the slide preview away (#465). */
function slidePeekHide() {
  if (SLIDE_PEEK) clearTimeout(SLIDE_PEEK.timer);
  SLIDE_PEEK = null;
  for (const p of document.querySelectorAll(".slidepeek")) {
    if (p._anchor?.getAttribute("aria-describedby") === "slidepeek") p._anchor.removeAttribute("aria-describedby");
    p.remove();
  }
}
