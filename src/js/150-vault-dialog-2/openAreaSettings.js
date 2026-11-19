/* What the area is (type), every area's colour, and the setup the area menu
   used to hold (#436): New area, Manage areas (folder, name, order), Invite. */
function openAreaSettings() {
  const colours = el("div", {class: "areacolours"},
    ...Spaces.list.map(sp => el("button", {class: "btn ghost", title: "Colour for " + sp.name,
      onclick: () => { closeModal(); openSpaceColor(sp.name, openAreaSettings); }},
      el("span", {class: "adot", "aria-hidden": "true", style: "background:" + spaceColor(sp.name)}),
      sp.name, el("small", {}, paletteName(spaceColor(sp.name))))));
  settingsDialog("Area - " + (Spaces.active || "area"), [
    el("div", {class: "field"}, el("label", {}, "Type"),
      segPicker(Object.values(HORIZON_PROFILES), horizonProfile().key, k => {
        setSetting("horizon_profile", k);
        render();
      })),
    el("div", {class: "field"}, el("label", {}, Spaces.list.length > 1 ? "Colours" : "Colour"), colours),
    el("div", {class: "field areasetup"},
      el("button", {class: "btn ghost", onclick: () => { closeModal(); newSpacePrompt(); }}, "+ New area"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openSpaceStorageSetup(); }}, "Manage areas"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openShareSpaceInvite(); }}, "Invite somebody"))], true);
}
