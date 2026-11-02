function spaceJournalColumns(day) {
  const host = el("div", {class: "space-journals"});
  for (const name of visibleSpaces()) {
    if (!LOADED.has(name)) {
      host.append(el("div", {class: "space-journal"}, el("h3", {}, name), el("p", {}, "This area is not available.")));
      continue;
    }
    host.append(inSpace(name, () => {
      const path = ensureJournal(day);
      const node = el("section", {class: "space-journal" + (name === Spaces.active ? " active-space" : ""),
        data: {space: name, path}}, el("h3", {}, name), pageOutline(path, {facts: "trackers"}));
      const activate = () => {
        activateJournalSpace(name);
        if (!SPACE_CONTEXT || SPACE_CONTEXT.space !== name) SPACE_CONTEXT = {space: name, path};
      };
      node.addEventListener("pointerdown", activate, true);
      node.addEventListener("focusin", activate, true);
      return node;
    }));
  }
  return host;
}
