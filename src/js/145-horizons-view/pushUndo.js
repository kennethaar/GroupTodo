function pushUndo(entry) {
  UNDO.push(Object.assign({at: Date.now()}, entry));
  while (UNDO.length > UNDO_KEEP) UNDO.shift();
}
