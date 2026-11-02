function heldActions() {
  return memo("heldActions", () => allLeafActions().filter(a => a.held)
    .sort((x, y) => x.held.localeCompare(y.held)));
}
