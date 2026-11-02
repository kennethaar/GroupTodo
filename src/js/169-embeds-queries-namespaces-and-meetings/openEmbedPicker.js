function openEmbedPicker(path, b) {
  const items = allPages(p => p !== path && !isArchived(p) && pageKind(p) !== "verb")
    .sort((x, y) => pageTitle(x).localeCompare(pageTitle(y)));
  listPicker({title: "Show which page here?", typeahead: true, items,
    label: p => pageTitle(p), detail: p => pageRef(p),
    onPick: p => putMacroLine(path, b, "{{embed [[" + linkRefTo(p) + "]]}}"),
    footer: el("span", {class: "hint", style: "text-align:left"},
      "For one line instead: its line menu → Copy as embed, then paste it here.")});
}
