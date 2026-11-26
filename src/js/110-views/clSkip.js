/* Skip the line for now: it is asked again after the rest. */
function clSkip(r) {
  CL.skip.add(clKey(r.path, r.block));
  CL.aim = 0;
  render();
}
