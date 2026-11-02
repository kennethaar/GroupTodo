function openTrackerPage(name) {
  const at = ensureTrackerPage(name);
  openPageIn(at.space, at.path);
}
