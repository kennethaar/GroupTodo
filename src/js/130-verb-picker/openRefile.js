function openRefile(fromPath, block) {
  // Picked after inSpace() has returned, so the area is held on to here.
  const space = V.space, file = p => inSpace(space, () => refileBlock(fromPath, block, p));
  // The pages the line already links to come first, so Alt+G then Enter files it there.
  const linked = refileLinked(fromPath, block), first = new Set(linked);
  listPicker({
    title: "Refile to a project, responsibility or context", hint: "type to filter",
    items: [...linked, ...refileTargets(fromPath).filter(p => !first.has(p))], typeahead: true,
    label: p => pageTitle(p),
    detail: p => (first.has(p) ? "linked · " : "") + refileKind(p),
    onPick: file,
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); inSpace(space, () => newProjectPrompt(file, bareLineName(block))); }}, "+ new project"),
  });
}
