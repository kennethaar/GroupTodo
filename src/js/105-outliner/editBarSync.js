function editBarSync() {
  let bar = $("#editBar");
  if (!FLY) {
    // Wait a frame: a move redraws the page and puts the caret straight back.
    if (bar) requestAnimationFrame(() => { if (!FLY) { bar.hidden = true; document.body.classList.remove("editbar-on"); } });
    return;
  }
  if (!bar) {
    bar = el("div", {id: "editBar", role: "toolbar", "aria-label": "Line tools"});
    // A swipe along the bar is scrolling it, not pressing a button: once the
    // touch has moved, the bar must get out of the way and let it scroll,
    // not hold the caret in place for a tap that was never made.
    let tx = 0, ty = 0, swiping = false;
    bar.addEventListener("touchstart", e => {
      swiping = false;
      const t = e.touches[0]; tx = t.clientX; ty = t.clientY;
    }, {passive: true});
    bar.addEventListener("touchmove", e => {
      const t = e.touches[0];
      if (Math.abs(t.clientX - tx) > 4 || Math.abs(t.clientY - ty) > 4) swiping = true;
    }, {passive: true});
    bar.addEventListener("mousedown", e => { if (!swiping) e.preventDefault(); });
    for (const r of EDIT_BAR) bar.append(el("button", {
      class: "ebtn", tabindex: "-1", data: {k: r.k}, onclick: () => editBarAct(r.k),
    }, el("span", {class: "eic"}, r.ic), el("span", {class: "elb"}, r.label)));
    document.body.append(bar);
  }
  const {path, block} = FLY;
  for (const btn of bar.children) {
    const r = EDIT_BAR.find(x => x.k === btn.dataset.k);
    let label = r.label, tip = r.tip;
    if (r.k === "kind" && block.state) { label = "Note"; tip = "Make it a note (Alt+T)"; }
    if (r.k === "mkarea" && statusDirOf(path) && !isJournalPath(path)) tip = "Turn the project into a responsibility (Alt+I)";
    btn.title = tip; btn.setAttribute("aria-label", tip);
    btn.querySelector(".elb").textContent = label;
  }
  bar.hidden = false;
  document.body.classList.add("editbar-on");
  editBarPlace();
}
