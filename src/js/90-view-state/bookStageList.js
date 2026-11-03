/* The task type stages:: names, if it is one: [[8/Chapter]] or just Chapter. */
function bookStageList() {
  const raw = trim(String(bookProps().stages || ""));
  if (!raw || (raw.includes(",") && !raw.includes("[["))) return null;
  const name = trim((/\[\[([^\]]+)\]\]/.exec(raw) || [, raw])[1].split("][")[0]);
  const path = findExistingPage(name) || findExistingPage("8/" + name);
  return path && isStateList(path) ? path : null;
}
