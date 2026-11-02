function npmClose() {
  npmCommit(); npmSave();
  const {space, path} = NPM;
  NPM = null; state.planPath = null;
  openPageIn(space, path);
}
