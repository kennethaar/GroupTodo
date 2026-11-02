/* Folders and servers belong to ONE space, which is what keeps Work out of
   Private: each space writes to its own place, chosen separately. */
async function connectFolder() {
  if (!window.showDirectoryPicker) {
    notify("This browser has no folder access. Use a vault file or the sync server instead.", "warn");
    return;
  }
  closeModal();
  await assignSpaceFolder(Spaces.active);
}
