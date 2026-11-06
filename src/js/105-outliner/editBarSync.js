function editBarSync() {
  let bar = $("#editBar");
  if (!FLY) {
    // Wait a frame: a move redraws the page and puts the caret straight back.
    if (bar) requestAnimationFrame(() => { if (!FLY) { bar.hidden = true; document.body.classList.remove("editbar-on"); } });
    return;
  }
  if (!bar) {
    bar = el("div", {id: "editBar", role: "toolbar", "aria-label": "Line tools"});
    bar.addEventListener("mousedown", e => e.preventDefault());
    // Movement first, then the Type/Tag/Media groups, then whatever is
    // marked to trail them (Side panel) -- the order the foot toolbar reads
    // left to right, not the order rows happen to sit in EDIT_BAR.
    const ebBtn = r => el("button", {
      class: "ebtn", tabindex: "-1", title: r.tip, "aria-label": r.tip, data: {k: r.k}, onclick: () => editBarAct(r.k),
    }, el("span", {class: "eic"}, r.ic.startsWith("<") ? svgIcon(r.ic) : r.ic), el("span", {class: "elb"}, r.label));
    for (const r of EDIT_BAR.filter(r => !r.group && !r.tail)) bar.append(ebBtn(r));
    for (const g of EDIT_BAR_GROUPS) bar.append(el("button", {
      class: "ebtn ebgrp", tabindex: "-1", title: g.label, "aria-label": g.label, "aria-haspopup": "menu",
      "aria-expanded": "false", data: {k: g.g}, onclick: e => editBarGroupToggle(g.g, e.currentTarget),
    }, el("span", {class: "eic"}, svgIcon(g.ic)), el("span", {class: "elb"}, g.label)));
    for (const r of EDIT_BAR.filter(r => r.tail)) bar.append(ebBtn(r));
    document.body.append(bar);
  }
  editBarGroupClose();
  bar.hidden = false;
  document.body.classList.add("editbar-on");
  editBarPlace();
}
