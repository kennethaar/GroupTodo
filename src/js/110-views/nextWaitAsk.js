function nextWaitAsk() {
  const r = WAIT_ASKS[0];
  if (!r) return;
  askAfterModal(() => solAskWaiting(r, () => { WAIT_ASKS.shift(); render(); setTimeout(nextWaitAsk, 0); }));
}
