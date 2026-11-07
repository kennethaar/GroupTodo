function npmBack() {
  npmCommit();
  if (NPM.q > 0) npmGo(NPM.step, NPM.q - 1);
  else if (NPM.step > 0) { const to = NPM.step - (npmSkips(NPM.step - 1) ? 2 : 1); npmGo(to, npmQs(to).length - 1); }
}
