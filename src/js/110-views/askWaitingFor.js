function askWaitingFor(space, path) {
  WAIT_ASKS.push({space, path});
  if (WAIT_ASKS.length === 1) setTimeout(nextWaitAsk, 0);
}
