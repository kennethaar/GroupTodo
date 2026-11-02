/* A page that moves or is renamed keeps its pin. */
function movePin(oldPath, newPath) {
  const list = pins(), i = pinAt(V.space, oldPath);
  if (i < 0) return;
  if (pinAt(V.space, newPath) >= 0) list.splice(i, 1); else list[i] = {...list[i], path: newPath};
  setPins(list);
}
