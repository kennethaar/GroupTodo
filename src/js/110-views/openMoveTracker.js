function openMoveTracker(name, here, day) {
  const others = visibleSpaces().filter(sp => LOADED.has(sp) && sp !== here);
  chipMenu("Which area does " + trackerTitle(name) + " belong to?", here ? "now in " + here : null,
    others.map((sp, i) => [String(i + 1), capitalise(sp), null, () => { moveTracker(name, sp, day); render(); }]));
}
