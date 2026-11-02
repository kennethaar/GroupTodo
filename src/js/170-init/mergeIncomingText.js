/* ---------- taking a markdown file in from the rest of the phone ---------- */
async function mergeIncomingText(text, label) {
  const invite = parseInvite(text);
  if (invite) { openInviteArrived(invite, text); return true; }
  // A colleague's check-in reply comes in through the same door as everything
  // else, because asking people to find the right button is how files get lost.
  const update = parseUpdateReply(text);
  if (update) { openUpdateArrived(update); return true; }
  const files = parseBundle(text);
  if (!files.size) {
    notify((label || "That file") + " has no GroupToDo pages or updates in it.", "error");
    return false;
  }
  notify(syncSummary(mergeBundle(files)));
  await mergeBundleAssets(text);
  markImported();
  render();
  return true;
}
