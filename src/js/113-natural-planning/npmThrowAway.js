function npmThrowAway() {
  const {space, path} = NPM;
  npmForget(space, path);
  NPM = null; state.planPath = null;
  notify("Draft thrown away. The page is as it was.");
  openPageIn(space, path);
}
