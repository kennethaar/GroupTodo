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
    /* On a line (#395): Tag, Media, Notepad and Side panel wait behind ＋
       Insert. Not ⋯: the line menu's own ⋯ sits right after the bar, and two
       alike buttons side by side make you guess which is which. */
    bar.append(el("button", {class: "ebrest", tabindex: "-1", title: "Insert: tag, media, notepad, side panel", "aria-label": "Insert",
      "aria-expanded": "false", data: {k: "rest"}, onclick: () => editBarRestShow(bar, !bar.classList.contains("all"))}, "＋"));
    // A tap on the tools is not a click on the line they sit on.
    for (const t of ["pointerdown", "click", "dblclick"]) bar.addEventListener(t, e => e.stopPropagation());
    // On a line, its first row makes room as wide as the bar (+ its margin);
    // the rows below run under it. Kept as the bar grows (＋) or shrinks.
    if (window.ResizeObserver) new ResizeObserver(() => {
      const line = bar.parentNode;
      if (line && line.classList && line.classList.contains("line")) line.style.setProperty("--ebw", bar.offsetWidth + 6 + "px");
    }).observe(bar);
    document.body.append(bar);
  }
  editBarGroupClose();
  bar.hidden = false;
  const line = editBarInline() && FLY.txt.closest(".line");
  if (line) {
    if (bar.parentNode !== line) {
      editBarRestShow(bar, false);
      if (bar.parentNode && bar.parentNode.style) bar.parentNode.style.removeProperty("--ebw");
      line.append(bar);
    }
    bar.classList.add("inline");
    line.style.setProperty("--ebw", bar.offsetWidth + 6 + "px");
    bar.style.left = bar.style.bottom = "";
    document.body.classList.remove("editbar-on");
    return;
  }
  if (bar.parentNode !== document.body) document.body.append(bar);
  bar.classList.remove("inline", "all");
  document.body.classList.add("editbar-on");
  editBarPlace();
}
