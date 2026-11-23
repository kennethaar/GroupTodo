/* Copy for AI ▾ on the bar under picked lines (#483): Plan, as Plan with AI
   always did, or Slides, whose answer goes after the last picked line. */
function lineSelAiMenu(btn) {
  const hud = $("#lselHud"), open = hud && hud.querySelector(".ebsub");
  if (open) { open.remove(); btn.setAttribute("aria-expanded", "false"); return; }
  const pop = el("div", {class: "ebpop ebsub", role: "menu", "aria-label": "Copy for AI"});
  for (const [k, name] of AI_COPY_CHOICES) pop.append(el("button", {class: "ebtn", tabindex: "-1", role: "menuitem", data: {ai: k},
    onclick: () => {
      const got = lineSelBlocks();
      if (!got) return;
      const path = LINE_SEL.path, src = planSourceOfLines(path, got.blocks), last = got.blocks[got.blocks.length - 1];
      lineSelClear();
      if (k === "slides") openSlidesWithAI(src, {after: last.id}); else openPlanWithAI(src);
    }}, el("span", {class: "ebcheck", "aria-hidden": "true"}), el("span", {class: "elb"}, name)));
  hud.append(pop);
  btn.setAttribute("aria-expanded", "true");
  const hr = hud.getBoundingClientRect(), br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  pop.style.left = Math.max(2 - hr.left, Math.min(br.left, innerWidth - pr.width - 2) - hr.left) + "px";
}
