function npmUndoFirst() {
  const k = (NPM.firstLast || []).pop();
  if (k === undefined) return;
  delete npmBefore()[k];
  npmSave(); render();
}
