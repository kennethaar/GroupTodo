function openRemoveArea(name, back) {
  const sp = Spaces.get(name);
  if (!sp) return;
  const pages = LOADED.get(name)?.pages.size || 0;
  const what = sp.kind === "fs"
    ? "Its files stay in \u201C" + (sp.label || "its folder") + "\u201D. Choose that folder again to bring it back."
    : sp.kind === "http"
      ? "Its files stay on the server."
      : "It is kept only in this browser, so its " + (pages ? pages + " " : "") +
        "pages are deleted. Save its vault file first if you want them.";
  const leave = () => { closeModal(); if (back) back(); };
  modal({
    center: true, title: "Remove " + name + "?",
    body: el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.55"},
      "GroupToDo stops showing " + name + " on this device. " + what),
    foot: [
      el("button", {class: "btn ghost", onclick: leave}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn danger", onclick: async () => {
        closeModal();
        if (await removeArea(name)) notify(name + " is removed.");
        if (back) back();
      }}, "Remove " + name),
    ],
  });
}
