function pickProtagonist() {
  const chars = castEntries().filter(e => e.type === "character"), cur = bookProtagonist();
  listPicker({title: "The protagonist", items: chars, label: e => e.name, typeahead: true,
    detail: e => e.key === cur ? "now" : null, start: Math.max(0, chars.findIndex(e => e.key === cur)),
    onPick: e => setProtagonist(e)});
}
