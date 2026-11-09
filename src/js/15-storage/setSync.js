function setSync(state, text) {
  SYNC_SHOWN = [state, text];
  if (state === "ok") SAVED_AT = new Date().toTimeString().slice(0, 5);
  drawSync();
}
