/* Recolour an existing space. Nothing is written until "Use colour", so trying
   colours out costs nothing; `back` is where Cancel and Save return to. */
function openSpaceColor(name, back) {
  const sp = Spaces.get(name);
  if (!sp) return;
  const before = spaceColor(name);
  let chosen = before;
  const preview = colorPreview(name, before);
  const picker = colorPicker(before, c => { chosen = c; preview.paint(c); });
  const leave = () => { closeModal(); if (back) back(); };

  modal({
    center: true, title: "Colour for " + name,
    hint: sp.kind === "fs" ? (sp.label || "folder") : sp.kind === "http" ? "server" : "this browser",
    body: el("div", {class: "field"},
      el("label", {}, "Pick a colour"),
      picker,
      preview.node,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:10px"},
        "The colour of " + name + " in the sidebar, in the area switcher, and on the badge " +
        "every row carries when several areas are shown at once. Kept in this device's list " +
        "of areas, so it is not inside the folder or file you share.")),
    foot: [
      el("button", {class: "btn ghost", onclick: leave}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: async () => {
        if (chosen !== before) {
          await Spaces.setColor(name, chosen);
          notify(name + " is now " + paletteName(chosen) + ".");
        }
        leave();
        render();
      }}, "Use colour"),
    ],
  });
}
