function npmFirstTake(to) {
  const loose = npmLoose(), cur = npmUnplaced(loose)[0];
  if (!cur || (to && npmLoops(cur.key, to, loose))) return;
  npmBefore()[cur.key] = to || "";
  (NPM.firstLast || (NPM.firstLast = [])).push(cur.key);
  npmSave(); render();
}
