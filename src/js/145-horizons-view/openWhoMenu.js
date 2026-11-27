/* The who pill names someone with the task; it does not have to choose
   between opening the task, asking them, reading in their reply, taking it
   back or handing it to somebody else, so it offers all five. */
function openWhoMenu(a, anchor) {
  const {name, path, block, space} = a;
  const btn = (label, run) => el("button", {class: "btn ghost", style: "display:block;width:100%;text-align:left;margin-top:4px",
    onclick: run}, label);
  // Not just who can be handed a chore: everybody in the area, led by names like this one.
  const openChangePerson = () => openPersonPick({path, block, space, title: "Change person", near: name}, anchor);
  const m = modal({
    title: name, center: true,
    body: el("div", {class: "whenpop"},
      btn("Open task", () => { closeModal(); inSpace(space, () => openTaskDetail(path, block, space)); }),
      btn("Ask for an update", () => { closeModal(); openAskForUpdate(name, block); }),
      // Their answer comes back to where you wait for it (#370).
      btn("Paste a reply", () => { closeModal(); importUpdatePasted(); }),
      btn("Take it back", () => { closeModal(); inSpace(space, () => assignBlock(path, block, "")); }),
      btn("Change person", openChangePerson)),
  });
  anchorModal(m.root, anchor);
}
