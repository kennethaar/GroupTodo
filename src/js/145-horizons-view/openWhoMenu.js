/* The who pill names someone with the task; it does not have to choose
   between opening the task and asking them, so it offers both. */
function openWhoMenu(a, anchor) {
  const {name, path, block, space} = a;
  const m = modal({
    title: name, center: true,
    body: el("div", {class: "whenpop"},
      el("button", {class: "btn ghost", style: "display:block;width:100%;text-align:left",
        onclick: () => { closeModal(); inSpace(space, () => openTaskDetail(path, block, space)); }}, "Open task"),
      el("button", {class: "btn ghost", style: "display:block;width:100%;text-align:left;margin-top:4px",
        onclick: () => { closeModal(); openAskForUpdate(name, block); }}, "Ask for an update")),
  });
  anchorModal(m.root, anchor);
}
