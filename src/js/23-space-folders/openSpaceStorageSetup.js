/* Every area's settings in one place: folder, name, colour, order, removing,
   and new areas. The area menu (top right) and Vault & sync (bottom left)
   both lead here. */
function openSpaceStorageSetup({firstRun = false} = {}) {
  /* A card per area, side by side like the journals, so it is plain which
     area a folder is being picked for. */
  const body = el("div", {});
  const list = el("div", {class: "afolders"});
  const again = () => openSpaceStorageSetup({firstRun});
  const draw = () => {
    list.textContent = "";
    for (const sp of Spaces.list) {
      const placed = sp.kind === "fs";
      const where = placed ? "Folder: \u201C" + (sp.label || "folder") + "\u201D"
                  : sp.kind === "http" ? "In the server folder"
                  : "This browser only";
      const i = Spaces.list.indexOf(sp);
      const shift = d => el("button", {class: "afmove", "aria-label": "Move " + sp.name + (d < 0 ? " left" : " right"),
        title: d < 0 ? "Further left" : "Further right", disabled: !Spaces.list[i + d],
        onclick: async () => { if (await Spaces.move(sp.name, i + d)) { render(); draw(); } }}, d < 0 ? "\u2039" : "\u203A");
      list.append(areaDraggable(el("div", {class: "afcard", style: "--sc:" + sp.color,
        title: "Drag to change where " + sp.name + " sits when it is shown"},
        el("div", {class: "afhead"},
          el("button", {class: "afdot", style: "background:" + spaceColor(sp.name),
            title: "Change " + sp.name + "'s colour", "aria-label": "Colour for " + sp.name,
            onclick: () => { closeModal(); openSpaceColor(sp.name, again); }}),
          el("div", {class: "afname"}, sp.name),
          Spaces.list.length > 1 ? el("span", {class: "afmoves"}, shift(-1), shift(1)) : null),
        el("div", {class: "afwhere" + (placed || sp.kind === "http" ? "" : " off")}, where),
        verbTasksToggle(sp.name),
        el("div", {class: "afbtns"},
          CAP.dirPicker ? el("button", {class: "btn sm " + (placed ? "ghost" : "primary"),
            // The bring-the-pages question replaces this dialog; open it again after.
            onclick: async () => { if (await assignSpaceFolder(sp.name)) list.isConnected ? draw() : again(); }},
            placed ? "Change folder" : "Choose folder") : null,
          // serve.py's folder, while no area lives there yet (#356).
          SERVER_BASE && !serverFolderUsers().length ? el("button", {class: "btn sm ghost",
            onclick: async () => { if (await useServerFolder(sp.name)) list.isConnected ? draw() : again(); }},
            "Use server folder") : null,
          el("button", {class: "btn sm ghost", onclick: () => openRenameArea(sp.name)}, "Rename"),
          Spaces.list.length > 1
            ? el("button", {class: "btn sm ghost", onclick: () => { closeModal(); openRemoveArea(sp.name, again); }}, "Remove")
            : null)), sp.name, draw));
    }
  };
  draw();
  body.append(...[
    CAP.dirPicker ? null : el("div", {class: "afnote", style: "margin:0 0 14px"},
      "This browser cannot open folders. Use desktop Chrome or Edge, or a vault file."),
    list,
    el("div", {class: "afnote"}, "The order here, left to right, is the order areas sit in when shown; drag a card to change it."),
    serverFolderRow(again, () => { if (list.isConnected) draw(); })].filter(Boolean));

  // Whichever way this closes, the day's routine still has to start.
  const done = async () => {
    for (const sp of Spaces.list) sp.askedStorage = true;
    await Spaces.save();
    closeModal();
    afterFirstRun();
  };

  modal({
    center: true,
    title: "Your areas",
    body,
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); newSpacePrompt(() => again()); }}, "+ New area"),
      firstRun ? null : el("button", {class: "btn ghost", onclick: () => { closeModal(); openShareSpaceInvite(); }}, "Invite somebody"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => done()}, "Done"),
    ],
  });
}
