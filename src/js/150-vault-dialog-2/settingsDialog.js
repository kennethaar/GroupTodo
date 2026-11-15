/* A settings page one level down: a title, rows, and a way back to Settings. */
function settingsDialog(title, groups, back) {
  const toSettings = () => { closeModal(); if (state.view === "checklists") render(); else go("checklists"); };
  modal({
    center: true, title,
    body: el("div", {}, ...groups),
    foot: [
      back ? el("button", {class: "btn ghost", onclick: toSettings}, "Settings") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
    ].filter(Boolean),
  });
}
