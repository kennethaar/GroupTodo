/* A line with a slide layout word (#481): its bullet is the layout's icon,
   named on hover, to screen readers and on the line for the keyboard. The
   bullet's own hint and the line's own description (a crowded slide, #433)
   are kept and put after it. Painted again when the line is left.
   With no word, a line whose lines end in numbers is a line chart (#482):
   its icon is faint and named a guess, and nothing is written. */
function paintSlideBullet(handle, txt, title, block = null) {
  const d = handle.dataset;
  d.tip ??= handle.title;
  d.desc ??= txt.getAttribute("aria-description") || "";
  let lay = slideWord(title), guess = false;
  if (!lay.layout && (block?.children || []).length >= 2 && slideLayout(block).layout === "line") {
    lay = slideWord("(line) " + title);
    guess = true;
  }
  const name = lay.layout ? "Slide layout: " + lay.name + (guess ? " (guessed)" : "") : "";
  handle.classList.toggle("slidelay", !!lay.layout);
  handle.classList.toggle("guess", guess);
  handle.textContent = lay.layout ? lay.icon : "";
  handle.title = [name, d.tip].filter(Boolean).join("\n");
  handle.setAttribute("aria-label", "Move this line" + (name ? ". " + name : ""));
  const desc = [name, d.desc].filter(Boolean).join(". ");
  if (desc) txt.setAttribute("aria-description", desc); else txt.removeAttribute("aria-description");
}
