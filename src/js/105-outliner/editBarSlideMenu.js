/* Slide layout ▾ (#433), a bar button of its own (#395): the layouts drop
   straight from it, the one the marks give now ticked. A second tap on the
   button closes it, as a group's does. */
function editBarSlideMenu(btn) {
  const bar = $("#editBar"), open = bar.querySelector(".ebsub");
  editBarGroupClose();
  if (open) return;
  const pop = slideMenuPop(slideLayoutNow(FLY.path, editBarSlideLines(FLY.block)),
    lay => { editBarGroupClose(); editBarSlideLayout(lay); });
  bar.append(pop);
  btn.setAttribute("aria-expanded", "true");
  const br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  pop.style.left = Math.max(2, Math.min(br.left, innerWidth - pr.width - 2)) + "px";
  // On a line the menu drops below the button; at the foot it rises above.
  if (bar.classList.contains("inline")) pop.style.top = (br.bottom + 4) + "px";
  else pop.style.bottom = (innerHeight - br.top + 4) + "px";
  document.addEventListener("click", editBarGroupOutside, {capture: true});
  document.addEventListener("keydown", editBarGroupEsc, {capture: true});
}
