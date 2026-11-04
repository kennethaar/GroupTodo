/* Planner's own setup: the sender, the status and the flow all live here, not in Settings. */
function openPlannerDialog() {
  const hint = (text, top) => el("div", {style: "color:var(--fg3);font-size:12px;margin-top:" + (top || 6) + "px"}, text);
  const toggle = (on, title, sub, flip) => el("div", {style: "display:flex;gap:10px;align-items:flex-start"},
    settingsToggle(on, title, flip), el("div", {}, el("div", {}, title), sub ? hint(sub, 2) : null));
  settingsDialog("Microsoft Planner", [plannerField(hint, toggle)], false);
  document.querySelector("#modalRoot .modal .foot")?.prepend(
    el("button", {class: "btn ghost", onclick: openIntegrationsDialog}, "Integrations"));
}
