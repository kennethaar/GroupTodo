/* Settings: the one place for setup, at the foot of the sidebar (#397). The
   view keeps its old id, checklists, so vaults' sidebar pages still find it.
   An index of names leads to each part; most-asked first, rare and risky last.
   Routines and lists are things you use, so they live in Routines. */
function viewChecklists() {
  const c = el("div", {class: "wrap setwrap"});
  const v = vaultSettingsParts();
  const cal = calendarSettingsSection();
  const parts = [
    ["sync", "Vault & sync", v.sync],
    ["you", "You", v.you],
    ["styles", "Styles", styleSection()],
    ["sidebar", "Sidebar", sidebarSettingsSection()],
    ["writing", "Writing", writingSettingsSection()],
    ["prefs", "Preferences", v.prefs],
    ["area", "Area", v.area],
    cal ? ["calendars", "Calendars", cal] : null,
    ["book", "Book", bookSettingsSection()],
    ["help", "Help", helpSettingsSection()],
    ["app", "GroupToDo", v.app],
    // Shown, not one level down: setup you cannot see is setup you search for.
    ["integrations", "Integrations", integrationsSettings()],
    ["advanced", "Advanced", el("div", {}, advancedSettings(), v.danger)],
  ].filter(Boolean);
  c.append(vhead("Settings", "Everything you set up, in one place."));
  c.append(el("nav", {class: "setindex", "aria-label": "Parts of Settings"},
    ...parts.map(([key, label]) => el("button", {class: "textbtn", "data-to": "set-" + key,
      onclick: () => settingsShow(key)}, label))));
  const body = el("div", {class: "setbody"});
  for (const [key, , node] of parts) body.append(el("section", {class: "setpart", id: "set-" + key}, node));
  c.append(body);
  return c;
}
