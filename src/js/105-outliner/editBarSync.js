function editBarSync() {
  let bar = $("#editBar");
  if (!FLY) {
    // Wait a frame: a move redraws the page and puts the caret straight back.
    // On a line, its row above goes too, and the line holds still (#395).
    if (bar) requestAnimationFrame(() => { if (!FLY) {
      const on = bar.classList.contains("inline") && !bar.hidden && bar.parentNode;
      editBarHold(on && on.querySelector && on.querySelector(".txt"), () => { bar.hidden = true; });
      document.body.classList.remove("editbar-on");
    } });
    return;
  }
  if (!bar) {
    bar = el("div", {id: "editBar", role: "toolbar", "aria-label": "Line tools"});
    bar.addEventListener("mousedown", e => e.preventDefault());
    // Movement first, then the Type/Tag/Media groups, then whatever is
    // marked to trail them (Side panel) -- the order the foot toolbar reads
    // left to right, not the order rows happen to sit in EDIT_BAR.
    // A row with a menu of its own (Slide layout) opens it like a group does.
    const ebBtn = r => el("button", {
      class: r.sub ? "ebtn ebgrp" : "ebtn", tabindex: "-1", title: r.tip, "aria-label": r.tip, data: {k: r.k},
      ...(r.sub ? {"aria-haspopup": "menu", "aria-expanded": "false", onclick: e => editBarSlideMenu(e.currentTarget)}
        : {onclick: () => editBarAct(r.k)}),
    },el("span", {class: "eic"}, r.ic.startsWith("<") ? svgIcon(r.ic) : r.ic), el("span", {class: "elb"}, r.label));
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
      "aria-expanded": "false", data: {k: "rest"}, onclick: () => {
        // A toggle that is kept: who wants every tool on show keeps them (#410).
        const open = !bar.classList.contains("all");
        PREF.set("linetools", open ? "all" : "");
        editBarRestShow(bar, open);
      }}, "＋"));
    // A tap on the tools is not a click on the line they sit on.
    for (const t of ["pointerdown", "click", "dblclick"]) bar.addEventListener(t, e => e.stopPropagation());
    document.body.append(bar);
  }
  editBarGroupClose();
  const line = editBarInline() && FLY.txt.closest(".line");
  if (line) {
    // The line makes room above itself; the page scrolls so it holds still.
    editBarHold(FLY.txt, () => {
      bar.hidden = false;
      if (bar.parentNode !== line) {
        editBarRestShow(bar, PREF.get("linetools") === "all");
        line.append(bar);
      }
      bar.classList.add("inline");
      bar.style.bottom = "";
      editBarPlaceInline(bar, line);
    });
    if (window.ResizeObserver) {
      bar._ro = bar._ro || new ResizeObserver(() => { const l = bar.parentNode; if (l && bar.classList.contains("inline")) editBarPlaceInline(bar, l); });
      bar._ro.disconnect();
      bar._ro.observe(line);
    }
    document.body.classList.remove("editbar-on");
    return;
  }
  bar.hidden = false;
  if (bar.parentNode !== document.body) document.body.append(bar);
  bar.classList.remove("inline", "all");
  bar.style.top = "";
  if (bar._ro) bar._ro.disconnect();
  document.body.classList.add("editbar-on");
  editBarPlace();
}
