/* The line menu's way in: the trackers already in use, or the wizard. */
function openTrackerPicker(onDone, path, line = null) {
  const items = trackerList();
  if (!items.length) { openTrackerWizard(onDone, path, line); return; }
  listPicker({
    title: "Insert tracker", hint: "the same name keeps one history", items, typeahead: true,
    label: g => trackerTitle(g.name), detail: g => trackerKindWords(g.code),
    onPick: g => onDone(g.key + "::", null),
    footer: el("button", {class: "btn ghost", onclick: () => openTrackerWizard(onDone, path, line)}, "+ Set up a new tracker"),
  });
}
