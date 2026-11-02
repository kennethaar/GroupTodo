/* Whichever of the two this area needs. */
function offerFolderBack(name) {
  if (PENDING_GRANT.has(name)) offerFolderReconnect(name);
  else if (LOST_FOLDER.has(name)) offerFolderPick(name);
}
