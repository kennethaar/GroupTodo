/* Format › Slide layout ▸ (#433): the layouts beside the Format menu, the
   one the marks give now ticked. It opens on the side with room; a second
   tap on Slide layout closes it. */
function editBarSlideMenu(btn) {
  const bar = $("#editBar"), open = bar.querySelector(".ebsub");
  if (open) { open.remove(); btn.setAttribute("aria-expanded", "false"); return; }
  const now = slideMarkOf(editBarSlideLines(FLY.block)) || "auto";
  const pop = el("div", {class: "ebpop ebsub", role: "menu", "aria-label": "Slide layout"});
  for (const [lay, name, mark] of SLIDE_MENU) {
    const on = lay === now || (lay === "split" && now === "quadrant");
    pop.append(el("button", {
      class: "ebtn", tabindex: "-1", role: "menuitemradio", "aria-checked": String(on), data: {lay},
      onclick: () => { editBarGroupClose(); editBarSlideLayout(lay); },
    }, el("span", {class: "ebcheck", "aria-hidden": "true"}, on ? "✓" : ""), el("span", {class: "elb"}, name),
      el("span", {class: "ebmark", "aria-hidden": "true"}, mark)));
  }
  bar.append(pop);
  btn.setAttribute("aria-expanded", "true");
  const br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  const right = br.right + 2 + pr.width <= innerWidth;
  pop.style.left = Math.max(2, right ? br.right + 2 : br.left - pr.width - 2) + "px";
  pop.style.top = Math.max(2, Math.min(br.top, innerHeight - pr.height - 2)) + "px";
}
