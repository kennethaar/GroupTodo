/* The newest visit here, whose person and project a new one starts from. */
function lastTimeLog() {
  const all = timeLogEntries();
  return all.filter(e => e.space === V.space).pop() || all[all.length - 1] || null;
}
