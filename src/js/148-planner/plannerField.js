/* The Vault & sync field. A folder on this computer is needed: the flow reads
   the outbox where OneDrive or SharePoint has put it. */
function plannerField(hint, toggle) {
  const area = Spaces.active || "this area";
  const box = el("div", {class: "field"}, el("label", {}, "Microsoft Planner (experimental)"));
  if (!(V.backend && V.backend.kind === "fs")) {
    box.append(hint("Needs a folder on this computer, in Chrome or Edge, that OneDrive or SharePoint syncs. " +
      "Choose one above first.", 0));
    return box;
  }
  const body = el("div");
  const draw = () => {
    body.textContent = "";
    const sender = plannerSender();
    body.append(toggle(!!sender, "Send " + area + "'s projects to Planner",
      "One card per project, in a bucket per client organisation, with its next actions as the checklist. " +
      "A Power Automate flow puts them in the plan. Nothing comes back yet but which card is which.",
      on => {
        if (on && !whoAmI()) { notify("Give your name above first: the projects are sent from your computer.", "warn"); draw(); return; }
        setPlannerSender(on ? whoAmI() : "");
        notify(on ? area + "'s projects go to Planner from this computer. Set up the flow to receive them."
                  : area + "'s projects are no longer sent to Planner. The cards already there stay.");
        if (on) plannerSync(Spaces.active, {force: true}).then(draw);
        else draw();
      }));
    if (!sender) return;
    if (!plannerIsMine()) {
      body.append(el("div", {style: "margin-top:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"},
        el("span", {style: "font-size:13px;color:var(--fg2)"}, "Sent from " + sender + "'s computer."),
        el("button", {class: "btn sm ghost", onclick: () => { setPlannerSender(whoAmI()); draw(); }},
          "Send from this computer instead")));
      return;
    }
    const note = PLANNER_NOTE.get(Spaces.active);
    if (note) body.append(el("div", {style: "margin-top:8px;font-size:13px;color:" +
      (note.level === "error" ? "var(--bad, #c33)" : note.level === "warn" ? "var(--warn, #b80)" : "var(--fg2)")},
      note.text + " (" + note.when.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) + ")"));
    body.append(el("div", {style: "margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"},
      el("button", {class: "btn sm ghost", onclick: async () => { await plannerSync(Spaces.active, {force: true}); draw(); }},
        "Send now"),
      el("a", {class: "btn sm ghost", href: PLANNER_DOC, target: "_blank", rel: "noopener"}, "How to set up the flow")));
  };
  draw();
  box.append(body, hint("Experimental. Writes planner/outbox.json in the folder and reads the flow's planner/state.json; " +
    "new cards are remembered as planner_id:: on the project page."));
  return box;
}
