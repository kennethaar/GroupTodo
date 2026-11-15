function openIntegrationsDialog() {
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
      openIntegrationsDialog();
    }}, usageOn() ? "Turn off" : "Turn on"));
  /* #404: a pasted video or post link goes to its site for a title only when
     this is on, so it is off until asked for. */
  const titles = PREF.get("linktitles") === "1";
  const linkTitles = settingsRow("Titles for pasted links", titles ? "On · YouTube, Vimeo, X, Spotify, SoundCloud" : "Off",
    el("button", {class: "btn sm ghost", onclick: () => {
      PREF.set("linktitles", titles ? "" : "1");
      notify(titles ? "Pasted links stay as they are." : "A pasted video or post link offers its title. The link is sent to that site to ask.");
      openIntegrationsDialog();
    }}, titles ? "Turn off" : "Turn on"));
  const view = settingsRow("View usage", null,
    el("button", {class: "btn sm ghost", onclick: () => { closeModal(); openUsageReport(); }}, "View"));
  settingsDialog("Integrations", [settingsGroup(null, [planner, linkTitles, usage, view])], true);
}
