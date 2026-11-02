function renamePrompt(path, {focus = "name"} = {}) {
  const journal = isJournalPath(path);
  const here = path.split("/").slice(0, -1).join("/");
  const name = el("input", {value: pageTitle(path)});
  const folder = el("select", {"aria-label": "Folder"});
  for (const [dir, label] of pageFolderChoices(path)) folder.append(el("option", {value: dir}, label));
  folder.value = here;
  const save = () => {
    const title = trim(name.value), dir = folder.value;
    closeModal();
    let at = path;
    const code = Object.keys(STATUS_DIRS).find(k => STATUS_DIRS[k] === dir);
    if (!journal && title && title !== pageTitle(path)) at = renamePage(path, title, {status: dir === here ? null : code});
    if (!at || dir === here) return;
    if (code) setProjectStatus(at, code);
    else if (moveFile(at, join(dir, baseName(at) + ".md"))) { notify("Moved to " + dir.replace(/^pages\/?/, "") + "/."); render(); }
  };
  modal({
    center: true, title: journal ? "Move " + pageTitle(path) : "Rename or move",
    body: el("div", {},
      journal ? null : el("div", {class: "field"}, el("label", {}, "Name"), name),
      el("div", {class: "field"}, el("label", {}, "Folder"), folder,
        el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:6px"},
          "The folder is what the page is. Every link to it follows the move."))),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Save")],
    onKey: e => { if (e.key === "Enter") { save(); return true; } return false; },
  });
  setTimeout(() => (journal || focus === "folder" ? folder : name).focus(), 30);
}
