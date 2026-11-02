/* ---------- opening and leaving ---------- */
function npmOpen(space, path) {
  space = space || V.space;
  NPM = npmLoad(space, path);
  go("plan", {planPath: path, planSpace: space});
}
