/* Format › Slide layout ▸ (#433): the layouts beside the Format menu, the
   one the marks give now ticked. It opens on the side with room; a second
   tap on Slide layout closes it. */
function editBarSlideMenu(btn) {
  const bar = $("#editBar"), open = bar.querySelector(".ebsub");
  if (open) { open.remove(); btn.setAttribute("aria-expanded", "false"); return; }
  const pop = slideMenuPop(slideMarkOf(editBarSlideLines(FLY.block)),
    lay => { editBarGroupClose(); editBarSlideLayout(lay); });
  bar.append(pop);
  btn.setAttribute("aria-expanded", "true");
  const br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  const right = br.right + 2 + pr.width <= innerWidth;
  pop.style.left = Math.max(2, right ? br.right + 2 : br.left - pr.width - 2) + "px";
  pop.style.top = Math.max(2, Math.min(br.top, innerHeight - pr.height - 2)) + "px";
}
