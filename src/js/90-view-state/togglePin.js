function togglePin(path) {
  const list = pins(), i = pinAt(V.space, path);
  if (i >= 0) list.splice(i, 1); else list.push({space: V.space || "", path});
  setPins(list);
  notify(i >= 0 ? "Unpinned from the sidebar." : "Pinned to the sidebar.");
}
