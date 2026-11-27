/* Settings › Area (#521): every area's card right here, not two dialogs
   down. The same card as Your areas, plus each area's own type. Invite
   somebody sits once, under Vault & sync. */
function areaSettingsSection() {
  const toSettings = () => { if (state.view === "checklists") render(); else go("checklists"); };
  const cards = el("div", {class: "afolders setareas"},
    ...Spaces.list.map(sp => areaCard(sp, {redraw: render, again: toSettings, withType: true})));
  return settingsGroup("Area", [
    CAP.dirPicker ? null : el("div", {class: "afnote"},
      "This browser cannot open folders. Use desktop Chrome or Edge, or a vault file."),
    cards,
    el("div", {class: "afnote"}, "Drag a card to reorder."),
    serverFolderRow(toSettings, render),
    el("div", {class: "areasetup"},
      el("button", {class: "btn sm ghost", onclick: () => newSpacePrompt(toSettings)}, "+ New area")),
  ]);
}
