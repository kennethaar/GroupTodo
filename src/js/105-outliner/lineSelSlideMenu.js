/* Slide layout ▾ on the bar under picked lines (#433): the picked lines get
   the marks. A line inside a picked line comes along with it and is not
   marked; one picked line is marked the way the line tools mark it, so a
   picked title marks its items. The lines stay picked after the pick. */
function lineSelSlideMenu(btn) {
  const hud = $("#lselHud"), open = hud && hud.querySelector(".ebsub");
  if (open) { open.remove(); btn.setAttribute("aria-expanded", "false"); return; }
  const got = lineSelBlocks();
  if (!got) return;
  const inner = new Set();
  for (const b of got.blocks) walkBlocks(b.children, c => { inner.add(c); });
  const outer = got.blocks.filter(b => !inner.has(b));
  const lines = outer.length === 1 ? editBarSlideLines(outer[0]) : outer;
  const path = LINE_SEL.path;
  const pop = slideMenuPop(slideLayoutNow(path, lines), lay => {
    slideLayoutPick(path, lines, lay);
    paintLineSel();                    // the lines stay picked; the bar is drawn anew
  }, !!slideOwner(path, lines));
  // Hide in Present / Show in Present for all the picked lines at once (#467).
  const own = outer.filter(b => !b.state);
  if (own.length) {
    const show = own.every(b => /^_\s/.test(b.title || ""));
    pop.append(el("hr", {class: "ebsep", "aria-hidden": "true"}),
      el("button", {class: "ebtn", tabindex: "-1", role: "menuitem", data: {hide: show ? "show" : "hide"},
        onclick: () => { slideHideSet(path, outer); paintLineSel(); }},
        el("span", {class: "ebcheck", "aria-hidden": "true"}), el("span", {class: "elb"}, show ? "Show in Present" : "Hide in Present")));
  }
  hud.append(pop);
  btn.setAttribute("aria-expanded", "true");
  // Above the bar, its left edge under the button, inside the window.
  const hr = hud.getBoundingClientRect(), br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  pop.style.left = Math.max(2 - hr.left, Math.min(br.left, innerWidth - pr.width - 2) - hr.left) + "px";
}
