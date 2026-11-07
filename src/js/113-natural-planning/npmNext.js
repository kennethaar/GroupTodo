function npmNext() {
  npmCommit();
  if (npmQ().k === "order") NPM.ordered = true;
  if (npmQ().k === "people") NPM.peopleDone = true;
  const qs = npmQs(NPM.step);
  if (NPM.q < qs.length - 1) npmGo(NPM.step, NPM.q + 1); else npmGo(NPM.step + (npmSkips(NPM.step + 1) ? 2 : 1));
}
