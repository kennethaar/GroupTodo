/* A group button (Type, Tag, Media, More) opens a small popover of its own
   leaves right above itself, inside #editBar -- a child of the bar, not of
   the body, so a leaf tapped from the popover is still found at
   "#editBar [data-k=…]" the way a direct button always was. One leaf left in
   the group (Media losing Photo on a desktop) skips the popover and just
   acts, the way a single-item menu never earns its own tap. */
function editBarGroupToggle(g, btn) {
  const bar = $("#editBar");
  const already = bar.querySelector(".ebpop");
  const reopening = already && already.dataset.g === g;
  if (already) already.remove();
  if (reopening) return;
  const leaves = editBarGroupLeaves(g);
  if (leaves.length <= 1) { if (leaves.length) editBarAct(leaves[0].k); return; }
  const {path, block} = FLY;
  const pop = el("div", {class: "ebpop", data: {g}, role: "menu"});
  for (const r of leaves) {
    let label = r.label, tip = r.tip, ic = r.ic;
    if (r.k === "kind" && block.state) { label = "Note"; tip = "Make it a note (Alt+T)"; ic = EB_NOTE; }
    if (r.k === "mkarea" && statusDirOf(path) && !isJournalPath(path)) tip = "Turn the project into a responsibility (Alt+I)";
    pop.append(el("button", {
      class: "ebtn", tabindex: "-1", role: "menuitem", data: {k: r.k}, title: tip, "aria-label": tip,
      onclick: () => { editBarGroupClose(); editBarAct(r.k); },
    }, el("span", {class: "eic"}, ic.startsWith("<") ? svgIcon(ic) : ic), el("span", {class: "elb"}, label)));
  }
  bar.append(pop);
  const br = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  pop.style.left = Math.max(2, Math.min(br.left, innerWidth - pr.width - 2)) + "px";
  pop.style.bottom = (innerHeight - br.top + 4) + "px";
  btn.setAttribute("aria-expanded", "true");
  document.addEventListener("click", editBarGroupOutside, {capture: true});
  document.addEventListener("keydown", editBarGroupEsc, {capture: true});
}
function editBarGroupOutside(e) {
  const pop = $("#editBar .ebpop");
  if (pop && !pop.contains(e.target) && !e.target.closest(".ebgrp")) editBarGroupClose();
}
function editBarGroupEsc(e) {
  if (e.key === "Escape") editBarGroupClose();
}
