function npmBack() {
  npmCommit();
  if (NPM.q > 0) npmGo(NPM.step, NPM.q - 1);
  else if (NPM.step > 0) npmGo(NPM.step - 1, npmQs(NPM.step - 1).length - 1);
}
