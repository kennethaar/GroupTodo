/* "1 of 2" when more than one area waits for its folder. The browser asks for
   one folder per click, so the count says why the question comes back. */
function folderAskStep(name) {
  const waiting = new Set([...PENDING_GRANT.keys(), ...LOST_FOLDER]);
  if (!waiting.has(name)) return "";
  FOLDER_ASK.total = Math.max(FOLDER_ASK.total, waiting.size);
  if (FOLDER_ASK.total < 2) return "";
  return (FOLDER_ASK.total - waiting.size + 1) + " of " + FOLDER_ASK.total;
}
