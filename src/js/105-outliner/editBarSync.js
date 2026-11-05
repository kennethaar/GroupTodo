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
