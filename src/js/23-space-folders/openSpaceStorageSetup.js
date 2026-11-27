/* Every area's settings in one place: folder, name, colour, order, removing,
   and new areas. The area menu (top right) and Vault & sync (bottom left)
   both lead here. */
function openSpaceStorageSetup({firstRun = false} = {}) {
  /* A card per area, side by side like the journals, so it is plain which
     area a folder is being picked for. */
  const body = el("div", {});
  const list = el("div", {class: "afolders"});
  const again = () => openSpaceStorageSetup({firstRun});
  const redraw = () => list.isConnected ? draw() : again();
  const draw = () => list.replaceChildren(...Spaces.list.map(sp => areaCard(sp, {redraw, again})));
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
