/* Carry a page across the folder boundary, then follow it there. */
async function movePageToSpace(path, target) {
  if (await transferLinkedPages([{path, from: V.space}], target)) {
    await openSpace(target);
    openPage(path);
  }
}
