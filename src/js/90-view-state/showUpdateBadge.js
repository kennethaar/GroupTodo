/* Beside the name, top left, for as long as there is a newer version, so a
   toast closed in a hurry is not the only way back to it. */
function showUpdateBadge() {
  const b = $("#appUpdate");
  if (!b) return;
  b.hidden = !UPDATE;
  if (UPDATE) {
    b.textContent = "✨ New v" + UPDATE.version + " is ready";
    b.title = "See what's new in v" + UPDATE.version + ", and get it";
  }
}
