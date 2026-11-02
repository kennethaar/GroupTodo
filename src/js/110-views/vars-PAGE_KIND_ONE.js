// Every edit in the pane is written to the area its page lives in.
for (const ev of ["pointerdown", "focusin"])
  $("#pagePane").addEventListener(ev, () => { if (SIDE_SHOWN) activateJournalSpace(SIDE_SHOWN.space); }, true);
// A bullet in the pane focuses the pane, not the view beside it.
$("#pagePane").addEventListener("click", e => {
  const bullet = e.target.closest(".bullet"), blk = bullet && bullet.closest(".blk");
  if (!blk || !SIDE_SHOWN) return;
  e.stopPropagation();
  const b = inSpace(SIDE_SHOWN.space, () => sideBranch(getPage(SIDE_SHOWN.path), blk.dataset.id));
  if (b) focusSide(b);
}, true);
/* The pane is as wide as you drag its edge, on this device; a double-click
   gives it its own width back. */
(() => {
  const pane = $("#pagePane"), grip = el("div", {class: "panegrip", role: "separator", "aria-orientation": "vertical",
    title: "Drag to make it wider or narrower; double-click for the usual width"});
  const paint = () => { const w = Number(PREF.get("pane.width", "")); document.documentElement.style.setProperty("--panew", w > 0 ? w + "px" : "400px"); };
  paint();
  grip.addEventListener("dblclick", () => { PREF.set("pane.width", ""); paint(); });
  grip.addEventListener("pointerdown", e => {
    if (e.button) return;
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    grip.classList.add("on");
    const x0 = e.clientX, w0 = pane.getBoundingClientRect().width;
    let w = w0;
    const move = ev => {
      w = Math.round(Math.max(280, Math.min(window.innerWidth * 0.7, w0 + x0 - ev.clientX)));
      document.documentElement.style.setProperty("--panew", w + "px");
    };
    const up = () => { grip.removeEventListener("pointermove", move); grip.classList.remove("on"); PREF.set("pane.width", String(w)); };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up, {once: true});
    grip.addEventListener("pointercancel", up, {once: true});
  });
  pane.before(grip);
})();
const PAGE_KIND_ONE = {project: "Project", person: "Person", org: "Organisation", context: "Context",
  area: "Responsibility", goal: "Goal", zettel: "Note", email: "Email", review: "Review", checklist: "Routine or list", journal: "Day page",
  horizon: "Horizon", page: "Page", verb: "Verb"};
const PAGE_KINDS = {project: "Projects", person: "People", org: "Organisations", context: "Contexts",
  area: "Responsibilities", goal: "Goals", zettel: "Notes", email: "Emails", review: "Reviews", checklist: "Settings", journal: "Journals",
  horizon: "Horizons", page: "Other pages"};

/* ============================================================
   TODAY -- your day page
   What is due or late, then the next seven days, then the journal you are
   writing, one per space. Every section folds like a line in the outline:
   the arrow or the title folds it, and the bullet focuses on it.
   ============================================================ */
const foldKey = id => "fold.today." + id;
const sectionFolded = id => PREF.get(foldKey(id), "") === "1";
const toggleSection = id => { PREF.set(foldKey(id), sectionFolded(id) ? "" : "1"); render(); };
