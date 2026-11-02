const actChoresOut = () => actMineOpen().filter(a => isChore(a) && !choreStale(a)).length;
