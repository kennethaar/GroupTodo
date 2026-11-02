function undoLast() {
  while (UNDO.length) {
    const e = UNDO.pop();
    // Undo entries remain valid until removed by the bounded history.
    if (e.run()) return true;
  }
  notify("Nothing recent to undo.", "warn");
  return false;
}
