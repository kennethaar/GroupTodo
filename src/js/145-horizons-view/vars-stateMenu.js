const stateMenu = a => {
  const cols = stateColumns(a);
  if (cols) columnMenu(plainTitle(a.title), "state", cols);
  else chipMenu(plainTitle(a.title), "state", stateRows(a));
};
