function goTour(id) {
  const dest = tourDest(id);
  if (!dest) { notify("That link points at a part of the app that is not here.", "warn"); return; }
  tourMarkSeen(id);
  dest.go();
}
