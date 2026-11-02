function droppedFolders(dt) {
  return Array.from((dt && dt.items) || [])
    .map(it => { try { return it.webkitGetAsEntry && it.webkitGetAsEntry(); } catch (_) { return null; } })
    .filter(en => en && en.isDirectory).map(en => en.name);
}
