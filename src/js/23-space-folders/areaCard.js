/* One area's card: colour, name, order, folder, the verb rule, rename and
   remove. Your areas (the dialog) and Settings › Area (#521) both draw it.
   redraw draws the cards again; again opens the place the card sits in again,
   after a dialog took its place. withType adds the area's own type. */
function areaCard(sp, {redraw, again, withType = false}) {
  const placed = sp.kind === "fs";
  // An area in a server folder has a folder too: it changes one, never chooses a first.
  const inFolder = placed || sp.kind === "http";
  const where = placed ? "Folder: “" + (sp.label || "folder") + "”"
              : sp.kind === "http" ? "In the server folder" + ((o => o ? " “" + o.name + "”" : "")(
                  serverFolderOptions().find(x => x.users.includes(sp))))
              : "This browser only";
  const i = Spaces.list.indexOf(sp);
  const shift = d => el("button", {class: "afmove", "aria-label": "Move " + sp.name + (d < 0 ? " left" : " right"),
    title: d < 0 ? "Further left" : "Further right", disabled: !Spaces.list[i + d],
    onclick: async () => { if (await Spaces.move(sp.name, i + d)) { render(); redraw(); } }}, d < 0 ? "‹" : "›");
  // Its own type, read and written in that area, so another area's card never changes this one.
  const typed = withType && (sp.name === V.space || LOADED.has(sp.name));
  const type = typed ? el("label", {class: "aftype"}, "Type",
    settingsSelect("Type for " + sp.name, Object.values(HORIZON_PROFILES).map(p => [p.key, p.label]),
      inSpace(sp.name, () => horizonProfile().key),
      k => { inSpace(sp.name, () => setSetting("horizon_profile", k)); render(); })) : null;
  return areaDraggable(el("div", {class: "afcard", style: "--sc:" + sp.color,
    title: "Drag to change where " + sp.name + " sits when it is shown"},
    el("div", {class: "afhead"},
      el("button", {class: "afdot", style: "background:" + spaceColor(sp.name),
        title: "Change " + sp.name + "'s colour", "aria-label": "Colour for " + sp.name,
        onclick: () => { closeModal(); openSpaceColor(sp.name, again); }}),
      el("div", {class: "afname"}, sp.name),
      Spaces.list.length > 1 ? el("span", {class: "afmoves"}, shift(-1), shift(1)) : null),
    el("div", {class: "afwhere" + (inFolder ? "" : " off")}, where),
    type,
    verbTasksToggle(sp.name),
    el("div", {class: "afbtns"},
      CAP.dirPicker ? el("button", {class: "btn sm " + (inFolder ? "ghost" : "primary"),
        // The bring-the-pages question replaces the dialog; open it again after.
        onclick: async () => { if (await assignSpaceFolder(sp.name)) redraw(); }},
        inFolder ? "Change folder" : "Choose folder") : null,
      // serve.py's folders, while one is free and this area is in none (#357).
      useServerFolderButton(sp.name, moved => { if (moved) redraw(); }),
      el("button", {class: "btn sm ghost", onclick: () => openRenameArea(sp.name)}, "Rename"),
      Spaces.list.length > 1
        ? el("button", {class: "btn sm ghost", onclick: () => { closeModal(); openRemoveArea(sp.name, again); }}, "Remove")
        : null)), sp.name, redraw);
}
