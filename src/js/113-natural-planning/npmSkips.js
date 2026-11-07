// A step with nothing to ask is passed by: with one loose action, nothing can wait for it.
function npmSkips(step) {
  return NPM_STEPS[step]?.k === "first" && npmLoose().length < 2;
}
