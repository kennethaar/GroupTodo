/* Settings > Integrations, shown on the page (#397). */
function integrationsSettings() {
  const area = Spaces.active || "this area";
  const onFolder = V.backend && V.backend.kind === "fs";
  const sender = onFolder ? plannerSender() : "";
  const planner = !onFolder
    ? settingsRow("Microsoft Planner", "Needs a folder")
    : settingsRow("Microsoft Planner", sender ? "Sending " + area : "Not connected",
        el("button", {class: "btn sm ghost", onclick: openPlannerDialog}, sender ? "Manage" : "Set up"));
  const usage = settingsRow("Usage statistics", usageOn() ? "On" : "Off",
    el("button", {class: "btn sm ghost", onclick: () => {
      PREF.set("usage.off", usageOn() ? "1" : "");
      notify(usageOn() ? "Counting which screens you use." : "Not counting. What was counted stays until you delete the page.");
      render();
    }}, usageOn() ? "Turn off" : "Turn on"));
  const view = settingsRow("View usage", null,
    el("button", {class: "btn sm ghost", onclick: () => openUsageReport()}, "View"));
  return settingsGroup("Integrations", [planner, usage, view]);
}
