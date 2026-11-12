/* A new project is offered the whole plan first. The page is made and open
   behind the question, so Esc or a click outside leaves a page that works. */
/* notes(): the notes the line was written among, shown in each step (#368). */
function createProjectFlow(name, then, {notes = null} = {}) {
  const p = createProjectPage(name), space = V.space;
  const land = () => { if (then) then(p); else openPage(p); };
  if (!npmAskOn(space)) { askProjectOutcome(p, land, notes); return; }
  land();
  render();
  let chose = false;
  const pick = fn => () => { chose = true; closeModal(); fn(); };
  const plan = pick(() => npmOpen(space, p));
  const outcome = pick(() => askProjectOutcome(p, () => {}, notes));
  const later = pick(() => notify("Project created: " + pageTitle(p)));
  modal({
    center: true, title: "Plan “" + pageTitle(p) + "” now?", hint: "1 / 2 / 3 · esc",
    body: el("div", {},
      notes ? notes() : null,
      pickRow("1", "Plan it now", "6 short steps: why, outcome, ideas, next actions", plan),
      pickRow("2", "Just the outcome", "what done looks like, then a next action", outcome),
      pickRow("3", "Not now", "the page is ready; Plan is on it", later)),
    foot: el("label", {class: "npmnever"}, el("input", {type: "checkbox",
      onchange: e => PREF.set("npm.ask:" + (space || ""), e.target.checked ? "0" : "1")}),
      " Don't ask again" + (Spaces.list.length > 1 ? " in " + space : "") + ": go straight to the outcome"),
    onKey: e => { const f = {"1": plan, "2": outcome, "3": later}[e.key]; if (f) { f(); return true; } return false; },
    onClose: () => { if (!chose) notify("Project created: " + pageTitle(p)); },
  });
}
