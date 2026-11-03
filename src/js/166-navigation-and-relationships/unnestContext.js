// Out of its folder to the top again: @home/kitchen is @kitchen.
function unnestContext(child) {
  inSpace(child.space, () => shiftContext(child.path, join(DIRS.contexts, baseName(child.path) + ".md"),
    to => ctxName({path: to}) + " is on its own again."));
  render();
}
