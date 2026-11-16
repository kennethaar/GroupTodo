/* ＋ Insert opens the rest of the line's tools; open, it shows − so a second
   click plainly folds them away again (#410). */
function editBarRestShow(bar, open) {
  bar.classList.toggle("all", open);
  const b = bar.querySelector(".ebrest");
  if (!b) return;
  b.textContent = open ? "−" : "＋";
  b.setAttribute("aria-expanded", String(open));
  b.title = open ? "Fold the insert tools away" : "Insert: tag, media, notepad, side panel";
}
