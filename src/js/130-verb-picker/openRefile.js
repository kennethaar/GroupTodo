function openRefile(fromPath, block) {
  // Picked after inSpace() has returned, so the area is held on to here.
  const space = V.space, file = p => inSpace(space, () => refileBlock(fromPath, block, p));
  listPicker({
    title: "Refile to a project, responsibility or context", hint: "type to filter",
    items: refileTargets(fromPath), typeahead: true,
    label: p => pageTitle(p),
    detail: p => refileKind(p),
    onPick: file,
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); inSpace(space, () => newProjectPrompt(file, bareLineName(block))); }}, "+ new project"),
  });
}
