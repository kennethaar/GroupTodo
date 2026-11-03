/* Undo is the same as Put back, straight away. */
function darlingCut(block, what) {
  const space = V.space;
  render();
  notify(what + " is in your darlings.", "info", {label: "Undo", run: () => inSpace(space, () => putDarlingBack(block))});
}
