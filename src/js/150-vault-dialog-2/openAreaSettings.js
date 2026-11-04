/* What the area is (type) and its colour, once. Folder, name and order are in Manage areas. */
function openAreaSettings() {
  const colourPreview = colorPreview(Spaces.active || "Area", spaceColor(Spaces.active));
  settingsDialog("Area - " + (Spaces.active || "area"), [
    el("div", {class: "field"}, el("label", {}, "Type"),
      segPicker(Object.values(HORIZON_PROFILES), horizonProfile().key, k => {
        setSetting("horizon_profile", k);
        render();
      })),
    el("div", {class: "field"}, el("label", {}, "Colour"),
      colorPicker(spaceColor(Spaces.active), async c => {
        colourPreview.paint(c);
        if (await Spaces.setColor(Spaces.active, c)) renderNav();
      }),
      colourPreview.node),
    el("div", {class: "field"},
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openSpaceStorageSetup(); }}, "Manage areas"))], true);
}
